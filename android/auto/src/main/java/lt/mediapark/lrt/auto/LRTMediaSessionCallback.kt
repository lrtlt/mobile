package lt.mediapark.lrt.auto

import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.os.Bundle
import android.util.Log
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.LibraryResult
import androidx.media3.session.MediaLibraryService
import androidx.media3.session.MediaLibraryService.LibraryParams
import androidx.media3.session.MediaSession
import androidx.media3.session.SessionCommand
import androidx.media3.session.SessionError
import com.google.common.collect.ImmutableList
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import android.content.Context
import com.google.firebase.analytics.FirebaseAnalytics
import java.util.concurrent.Callable
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.RejectedExecutionException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import lt.mediapark.lrt.auto.data.AutoAuthManager
import lt.mediapark.lrt.auto.data.LRTAutoRepository
import lt.mediapark.lrt.auto.data.LRTAutoService
import lt.mediapark.lrt.auto.data.PlaylistItem
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LRTMediaSessionCallback(private val context: Context): MediaLibraryService.MediaLibrarySession.Callback  {

    private val repository: LRTAutoRepository
    private val authManager: AutoAuthManager
    private val scope = CoroutineScope(Dispatchers.Default)
    private var newestRefreshJob: Job? = null
    private var currentSession: MediaLibraryService.MediaLibrarySession? = null

    /**
     * Every browse runs here. One thread rather than one per call: [MediaItemTree] is a plain
     * mutable map, and two browses rebuilding different branches at once would race on it.
     */
    private val browseExecutor: ExecutorService = Executors.newSingleThreadExecutor()

    /**
     * The episode list a tap installed as the up-next queue, and how far into it we have resolved.
     *
     * An episode's stream URL lives in its article payload, so hydrating a whole category would
     * cost one request per row — and ExoPlayer cannot hold a [MediaItem] without a URI, so the
     * CarPlay trick of queueing unresolved entries and filling them in on arrival has no direct
     * equivalent. Instead the player's queue grows: the tapped episode goes in alone, and each
     * transition resolves and appends enough to stay [EPISODE_LOOKAHEAD] ahead. Requests stay
     * proportional to what the driver actually listens to.
     */
    private class EpisodeQueue(val mediaIds: List<String>, var nextIndex: Int)

    @Volatile
    private var episodeQueue: EpisodeQueue? = null

    /**
     * Browsables whose last load failed, each with the timer re-browsing it.
     *
     * Android Auto asks for a browsable's children once per subscription and then keeps them —
     * switching tabs does not re-browse. A tab whose load failed therefore kept its empty list
     * until the process restarted. Now the failure is kept here, and the head unit is told the
     * children changed, which is what makes it ask again: on a timer while the phone has a
     * network, and at once when a network comes back.
     *
     * A key stays until a browse of it succeeds, even after its timer runs out, so a network
     * returning later still retries it.
     */
    private val failedBrowses = ConcurrentHashMap<String, Job>()

    private val connectivityManager = context.getSystemService(ConnectivityManager::class.java)

    private val networkCallback = object : ConnectivityManager.NetworkCallback() {
        override fun onAvailable(network: Network) {
            val session = currentSession ?: return
            failedBrowses.keys.forEach { notifyBrowseChanged(session, it) }
        }
    }

    init {
        authManager = AutoAuthManager(context)
        val retrofit: Retrofit = Retrofit.Builder()
            .baseUrl("https://lrt.lt/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        val service: LRTAutoService = retrofit.create(LRTAutoService::class.java)
        repository = LRTAutoRepository(service)
        MediaItemTree.initialize()
        try {
            connectivityManager?.registerDefaultNetworkCallback(networkCallback)
        } catch (e: Exception) {
            // Losing this costs only the instant retry; the timed one still runs.
            Log.e(TAG, "Could not watch connectivity", e)
        }
    }

    private fun startHomeAutoRefresh(session: MediaLibraryService.MediaLibrarySession) {
        stopHomeAutoRefresh()
        currentSession = session
        newestRefreshJob = scope.launch {
            while (true) {
                delay(2 * 60 * 1000L) // 2 minutes
                try {
                    // The newest feed lives inside Home now, so the periodic refresh has to rebuild
                    // the whole browsable rather than a tab of its own. Routed through the browse
                    // executor so it cannot rebuild the tree underneath a browse in flight.
                    submitBlocking { loadHome(forceRefreshNewest = true) }.get()
                    // The count is read on the browse executor too — [notifyBrowseChanged], not a
                    // direct read here, because a retry-driven re-browse of another tab can be
                    // rebuilding the tree while this coroutine runs.
                    notifyBrowseChanged(session, MediaItemTree.HOME)
                    Log.d(TAG, "Auto-refreshed home")
                } catch (e: Exception) {
                    Log.e(TAG, "Error auto-refreshing home", e)
                }
            }
        }
    }

    private fun stopHomeAutoRefresh() {
        newestRefreshJob?.cancel()
        newestRefreshJob = null
    }

    private fun isAutomotive(packageName: String): Boolean {
        return packageName.contains("android.car") ||
                packageName.contains("androidauto") ||
                packageName.contains("com.google.android.projection.gearhead")
    }

    private fun logAnalyticsEvent(packageName: String, event: String) {
        if (!isAutomotive(packageName)) {
            return
        }

        try{
            Log.d(TAG, "logAnalyticsEvent: $event")
            FirebaseAnalytics.getInstance(context).logEvent(event, null)
        }catch (e: Exception){
            //
        }
    }

    private suspend fun fetchContinuePlaying(): List<PlaylistItem> {
        if (!authManager.isLoggedIn()) {
            // Blanks Home's `Klausykite toliau` rather than leaving a stale group behind after a
            // sign-out. Subscriptions are keyed by access token, but a logout that never
            // re-browses `Mano LRT` would otherwise keep the previous user's list for 5 minutes.
            repository.clearContinuePlayingCache()
            repository.clearSubscriptionsCache()
            return emptyList()
        }
        return try {
            val token = authManager.getAccessToken()
            repository.refreshContinuePlaying(token)
        } catch (e: Exception) {
            Log.e(TAG, "fetchContinuePlaying failed", e)
            emptyList()
        }
    }

    /**
     * Pushes one watch-history entry, then runs [onPushed] whether or not the push succeeded.
     *
     * The callback exists for the completion case. `onGetChildren` answers every browse with a
     * live fetch (§7 of docs/androidauto-ui.md), so notifying the head unit before the PUT has
     * landed races it: the GET can return the entry still marked unfinished and the row comes
     * straight back. Sequencing the notify after the push closes that.
     *
     * It runs on failure too — a repaint that reflects the local intent is better than a row
     * that silently stays, and the next browse re-fetches the truth anyway.
     */
    fun pushPlaybackProgress(
        entry: lt.mediapark.lrt.auto.data.WatchHistoryEntry,
        onPushed: (() -> Unit)? = null,
    ) {
        if (!authManager.isLoggedIn()) {
            onPushed?.invoke()
            return
        }
        scope.launch {
            try {
                val token = authManager.getAccessToken()
                Log.d(TAG, "pushPlaybackProgress: articleId=${entry.articleId} pos=${entry.positionSec}/${entry.durationSec} pct=${entry.progressPct} completed=${entry.completed}")
                repository.pushPlaybackProgress(entry, token)
            } catch (e: Exception) {
                Log.e(TAG, "pushPlaybackProgress failed", e)
            } finally {
                onPushed?.invoke()
            }
        }
    }

    /**
     * Home hosts `Klausykite toliau`, so it is the one browsable that has to repaint off a
     * playback event. The overflow folder is notified too — a driver sitting in `Daugiau`
     * would otherwise keep the pre-pause rows until they backed out.
     *
     * Notifies via [notifyBrowseChanged]: this runs in the push coroutine's `finally`, off the
     * browse executor, so a direct count read could race a browse rebuilding the tree — and an
     * exception from a `finally` would take the coroutine down with it.
     */
    fun notifyContinuePlayingChanged() {
        val session = currentSession ?: return
        notifyBrowseChanged(session, MediaItemTree.HOME)
        notifyBrowseChanged(session, MediaItemTree.CONTINUE_MORE_FOLDER)
    }

    /**
     * Accepts the connection with the two browse-search commands withheld, which is what removes
     * the search button Android Auto otherwise draws on every browsable.
     *
     * There is no flag for it. Media3's legacy stub sets the browse root's
     * `android.media.browse.SEARCH_SUPPORTED` extra from whether
     * [SessionCommand.COMMAND_CODE_LIBRARY_SEARCH] is available to the connecting controller, and it
     * overwrites whatever [onGetLibraryRoot] put in that key — so withholding the command is the
     * only way to say no.
     *
     * **This is the browse search box only.** Voice search is untouched: "play X" arrives as a
     * `requestMetadata.searchQuery` on [onSetMediaItems] and is answered from [MediaItemTree.search]
     * against the title index, which is a player command rather than a library one.
     */
    @OptIn(UnstableApi::class) override fun onConnect(
        mediaSession: MediaSession,
        controller: MediaSession.ControllerInfo
    ): MediaSession.ConnectionResult {
        logAnalyticsEvent(controller.packageName, "android_auto_connected")
        val accepted = super.onConnect(mediaSession, controller)
        return MediaSession.ConnectionResult.AcceptedResultBuilder(mediaSession)
            .setAvailableSessionCommands(
                accepted.availableSessionCommands.buildUpon()
                    .remove(SessionCommand.COMMAND_CODE_LIBRARY_SEARCH)
                    .remove(SessionCommand.COMMAND_CODE_LIBRARY_GET_SEARCH_RESULT)
                    .build()
            )
            .setAvailablePlayerCommands(accepted.availablePlayerCommands)
            .build()
    }

    @OptIn(UnstableApi::class) override fun onGetLibraryRoot(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        params: LibraryParams?
    ): ListenableFuture<LibraryResult<MediaItem>> {
        // Declare list as the default for both kinds of row; `Prenumeratos`, the one grid group
        // left, overrides it per item. Without CONTENT_STYLE_SUPPORTED the head unit ignores the
        // per-item hints entirely.
        val extras = Bundle().apply {
            putBoolean(MediaItemTree.KEY_CONTENT_STYLE_SUPPORTED, true)
            putInt(
                MediaItemTree.KEY_CONTENT_STYLE_BROWSABLE_HINT,
                MediaItemTree.CONTENT_STYLE_LIST_ITEM
            )
            putInt(
                MediaItemTree.KEY_CONTENT_STYLE_PLAYABLE_HINT,
                MediaItemTree.CONTENT_STYLE_LIST_ITEM
            )
        }
        val rootParams = LibraryParams.Builder()
            .setExtras(extras)
            .setRecent(params?.isRecent ?: false)
            .setOffline(params?.isOffline ?: false)
            .setSuggested(params?.isSuggested ?: false)
            .build()
        return Futures.immediateFuture(
            LibraryResult.ofItem(MediaItemTree.getRootItem(), rootParams)
        )
    }

    @OptIn(UnstableApi::class) override fun onGetItem(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        mediaId: String
    ): ListenableFuture<LibraryResult<MediaItem>> {
        MediaItemTree.getItem(mediaId)?.let {
            return Futures.immediateFuture(LibraryResult.ofItem(it, null))
        }
        return Futures.immediateFuture(LibraryResult.ofError(SessionError.ERROR_BAD_VALUE))
    }

    private fun <T> submitBlocking(task: suspend () -> T): ListenableFuture<T> {
        return Futures.submit(Callable {
            runBlocking { task() }
        }, browseExecutor)
    }

    /**
     * Home: `Klausykite toliau`, then `Siūlome` and `Naujausi`. All three are fetched together
     * because they land in one browsable, and only the first is auth-dependent — Home renders for
     * a logged-out driver.
     *
     * One feed is enough for Home to be worth drawing, and the two-minute refresh fills in the
     * other. Only when both fail is there nothing to show, and that throws for [browse] to turn
     * into its error row.
     */
    private suspend fun loadHome(forceRefreshNewest: Boolean = false) = coroutineScope {
        val recommendedFetch = async { runCatching { repository.getRecommended() } }
        val newestFetch = async {
            runCatching { repository.getNewest(forceRefresh = forceRefreshNewest) }
        }
        val continueFetch = async { fetchContinuePlaying() }
        val recommended = recommendedFetch.await()
        val newest = newestFetch.await()
        if (recommended.isFailure && newest.isFailure) {
            throw newest.exceptionOrNull()!!
        }
        MediaItemTree.applyHomeSections(
            continueFetch.await(),
            recommended.getOrDefault(emptyList()),
            newest.getOrDefault(emptyList())
        )
    }

    /**
     * Runs one browse's [load] and answers with [parentId]'s children.
     *
     * A load that throws has nothing to show — the repository falls back to stale lists on its
     * own and throws only without one — so the children become the error row and a re-browse is
     * scheduled rather than the head unit caching an empty list for good.
     */
    private fun browse(
        session: MediaLibraryService.MediaLibrarySession,
        parentId: String,
        params: LibraryParams?,
        load: suspend () -> Unit
    ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> = submitBlocking {
        try {
            load()
            failedBrowses.remove(parentId)?.cancel()
        } catch (e: Exception) {
            Log.e(TAG, "Loading $parentId failed", e)
            MediaItemTree.setLoadError(parentId)
            scheduleBrowseRetry(session, parentId)
        }
        LibraryResult.ofItemList(MediaItemTree.getChildren(parentId), params)
    }

    private fun scheduleBrowseRetry(
        session: MediaLibraryService.MediaLibrarySession,
        parentId: String
    ) {
        // A running timer is left alone: the re-browses it triggers land back here when they fail
        // too, and re-arming would restart it for as long as the failure lasts.
        if (failedBrowses[parentId]?.isActive == true) return
        failedBrowses[parentId] = scope.launch {
            repeat(BROWSE_RETRY_ATTEMPTS) {
                delay(BROWSE_RETRY_INTERVAL_MS)
                // Offline, a re-browse can only fail again; [networkCallback] covers the return.
                if (hasNetwork()) notifyBrowseChanged(session, parentId)
            }
        }
    }

    /**
     * Tells the head unit [parentId]'s children changed, which makes it re-browse them.
     *
     * Runs on [browseExecutor]: the child count is read from [MediaItemTree], and the tree is
     * mutated only on that thread — a count read from the retry timer or the connectivity callback
     * could catch a list mid-rebuild and throw, which would end the retry with the error row still
     * cached. Queuing behind any browse in flight also orders this notify after the load it
     * reports on, so the count it sends is the count the re-browse will find.
     *
     * Fire-and-forget: [session.notifyChildrenChanged] failing costs one retry cycle, not the
     * retry loop itself.
     */
    private fun notifyBrowseChanged(
        session: MediaLibraryService.MediaLibrarySession,
        parentId: String
    ) {
        try {
            browseExecutor.execute {
                try {
                    session.notifyChildrenChanged(
                        parentId,
                        MediaItemTree.getChildren(parentId).size,
                        null
                    )
                } catch (e: Exception) {
                    Log.e(TAG, "Notifying $parentId children changed failed", e)
                }
            }
        } catch (e: RejectedExecutionException) {
            // The service is shutting down; there is no head unit left to notify.
        }
    }

    private fun hasNetwork(): Boolean {
        val network = connectivityManager?.activeNetwork ?: return false
        return connectivityManager.getNetworkCapabilities(network)
            ?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true
    }

    @OptIn(UnstableApi::class) override fun onGetChildren(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        parentId: String,
        page: Int,
        pageSize: Int,
        params: LibraryParams?
    ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> {
        currentSession = session

        if (parentId == MediaItemTree.HOME) {
            logAnalyticsEvent(browser.packageName, "android_auto_recommended_open")
            startHomeAutoRefresh(session)
            return browse(session, parentId, params) { loadHome() }
        }

        if (parentId == MediaItemTree.CONTINUE_MORE_FOLDER) {
            return browse(session, parentId, params) { loadHome() }
        }

        if (parentId == MediaItemTree.RECOMMENDED_ALL) {
            logAnalyticsEvent(browser.packageName, "android_auto_recommended_all_open")
            return browse(session, parentId, params) {
                MediaItemTree.setRecommendedAllItems(repository.getRecommended())
            }
        }

        if (parentId == MediaItemTree.NEWEST_ALL) {
            logAnalyticsEvent(browser.packageName, "android_auto_newest_open")
            return browse(session, parentId, params) {
                MediaItemTree.setNewestAllItems(repository.getNewest(forceRefresh = true))
            }
        }

        if (parentId == MediaItemTree.LIVE) {
            logAnalyticsEvent(browser.packageName, "android_auto_live_open")
            return browse(session, parentId, params) {
                MediaItemTree.setLiveItems(repository.getLive())
            }
        }

        if(parentId == MediaItemTree.PODCAST_CATEGORIES) {
            logAnalyticsEvent(browser.packageName, "android_auto_podcasts_open")
            return browse(session, parentId, params) {
                // No subscriptions folder any more — that moved to Mano LRT, which is why this
                // browse has no auth dependency at all.
                MediaItemTree.setPodcastCategories(repository.getPodcastCategories())
            }
        }

        if (parentId == MediaItemTree.MANO_LRT) {
            logAnalyticsEvent(browser.packageName, "android_auto_mano_lrt_open")
            return browse(session, parentId, params) { loadManoLRT() }
        }

        MediaItemTree.getSubscriptionCategoryId(parentId).let {
            if (it > 0) {
                return browse(session, parentId, params) {
                    MediaItemTree.setSubscriptionEpisodes(it, repository.getPodcastEpisodes(it))
                }
            }
        }

        MediaItemTree.getPodcastCategoryId(parentId).let {
            if(it > 0) {
                return browse(session, parentId, params) {
                    MediaItemTree.setPodcastEpisodes(it, repository.getPodcastEpisodes(it))
                }
            }
        }

        val children = MediaItemTree.getChildren(parentId)
        if (children.isNotEmpty()) {
            return Futures.immediateFuture(LibraryResult.ofItemList(children, params))
        }
        return Futures.immediateFuture(LibraryResult.ofError(SessionError.ERROR_BAD_VALUE))
    }

    /**
     * Mano LRT: `Prenumeratos` and nothing else — `Klausykite toliau` lives in Home alone now. The
     * group is conditional, so a signed-in driver with no subscriptions sees a message row.
     *
     * A failed subscription fetch, or a token that would not renew, throws rather than reading as
     * having none — telling a subscriber they have no subscriptions is the wrong message, and
     * [browse] retries the failure where an empty list would have stayed.
     */
    private suspend fun loadManoLRT() {
        if (!authManager.isLoggedIn()) {
            MediaItemTree.setManoLRTLoggedOut()
            // Still clears the cache, so Home's `Klausykite toliau` goes with it.
            repository.clearContinuePlayingCache()
            repository.clearSubscriptionsCache()
            return
        }

        val allSubscriptions = repository.getSubscriptions(authManager.getAccessToken())
        // Video subscriptions are dropped: the same subscription list backs the phone app, where a
        // mediateka show is a legitimate thing to follow, but there is nothing to play from one
        // here. Filtered before the covers so a dropped tile costs no request either.
        val subscriptions = repository.categoryMediaTypes.keepAudio(allSubscriptions)
        val covers = repository.getSubscriptionCovers(subscriptions)
        MediaItemTree.applyManoLRTSections(subscriptions, covers)
    }

    override fun onAddMediaItems(
        mediaSession: MediaSession,
        controller: MediaSession.ControllerInfo,
        mediaItems: MutableList<MediaItem>
    ): ListenableFuture<MutableList<MediaItem>> {
        return Futures.immediateFuture(resolveMediaItems(mediaItems))
    }

    @OptIn(UnstableApi::class) // MediaSession.MediaItemsWithStartPosition
    override fun onSetMediaItems(
        mediaSession: MediaSession,
        browser: MediaSession.ControllerInfo,
        mediaItems: List<MediaItem>,
        startIndex: Int,
        startPositionMs: Long,
    ): ListenableFuture<MediaSession.MediaItemsWithStartPosition> {
        // Any new queue ends the previous episode window; only the episode branch re-arms it.
        episodeQueue = null

        if (mediaItems.size == 1) {
            val item = mediaItems.first()

            if (MediaItemTree.isEpisodeItem(item.mediaId)) {
                return startEpisodeQueue(item, startPositionMs)
            }

            // The one up-next rule: the group you tapped in becomes the queue. Utility rows are
            // browsable, so they are filtered out and can never shift the start index.
            val siblings = MediaItemTree.sectionSiblings(item.mediaId)
                .mapNotNull { MediaItemTree.expandItem(it) }
            if (siblings.isNotEmpty()) {
                val idx = siblings.indexOfFirst { it.mediaId == item.mediaId }.coerceAtLeast(0)
                val resumeMs = MediaItemTree.getStartPositionMs(item.mediaId)
                return Futures.immediateFuture(
                    MediaSession.MediaItemsWithStartPosition(
                        siblings,
                        idx,
                        if (startPositionMs > 0) startPositionMs else resumeMs
                    )
                )
            }

            // Playing a category browsable outright — by voice, or the head unit's play-the-folder
            // affordance — starts its episode list from the top. Without this the generic expansion
            // below hands over rows with no stream URI and nothing plays at all.
            val firstChild = MediaItemTree.getChildren(item.mediaId).firstOrNull()
            if (firstChild != null && MediaItemTree.isEpisodeItem(firstChild.mediaId)) {
                return startEpisodeQueue(firstChild, startPositionMs)
            }

            // Try to expand a single item to a playlist.
            maybeExpandSingleItemToPlaylist(mediaItems.first(), startIndex, startPositionMs)?.also {
                return Futures.immediateFuture(it)
            }
        }
        return Futures.immediateFuture(
            MediaSession.MediaItemsWithStartPosition(
                resolveMediaItems(mediaItems),
                startIndex,
                startPositionMs
            )
        )
    }

    /**
     * Installs the tapped episode's list as the up-next queue.
     *
     * Only the tapped episode is resolved here, so time-to-first-audio is what it always was; the
     * lookahead is filled by [topUpEpisodeQueue] once the player reports the transition into it.
     */
    @OptIn(UnstableApi::class)
    private fun startEpisodeQueue(
        item: MediaItem,
        startPositionMs: Long
    ): ListenableFuture<MediaSession.MediaItemsWithStartPosition> {
        val siblings = MediaItemTree.sectionSiblings(item.mediaId).map { it.mediaId }
        val tappedIndex = siblings.indexOf(item.mediaId)

        return submitBlocking {
            val resolved = resolveEpisode(item.mediaId)
                ?: return@submitBlocking MediaSession.MediaItemsWithStartPosition(
                    resolveMediaItems(listOf(item)), 0, startPositionMs
                )

            if (tappedIndex >= 0) {
                episodeQueue = EpisodeQueue(siblings, tappedIndex + 1)
            }
            MediaSession.MediaItemsWithStartPosition(listOf(resolved), 0, startPositionMs)
        }
    }

    /**
     * Keeps the player's queue [EPISODE_LOOKAHEAD] resolved episodes ahead of what is playing.
     * Called on every media item transition; a no-op unless an episode list is the queue.
     *
     * Must be called on the application thread — [Player] is confined to it.
     */
    fun topUpEpisodeQueue(player: Player) {
        val queue = episodeQueue ?: return
        if (queue.nextIndex >= queue.mediaIds.size) return

        val ahead = player.mediaItemCount - player.currentMediaItemIndex - 1
        val wanted = EPISODE_LOOKAHEAD - ahead
        if (wanted <= 0) return

        val batch = (queue.nextIndex until minOf(queue.nextIndex + wanted, queue.mediaIds.size))
            .map { queue.mediaIds[it] }
        queue.nextIndex += batch.size

        scope.launch {
            val resolved = coroutineScope {
                batch.map { async { resolveEpisode(it) } }.awaitAll()
            }.filterNotNull()
            if (resolved.isEmpty()) return@launch
            withContext(Dispatchers.Main) {
                // The driver can install an unrelated queue while these were in flight; appending
                // then would splice episodes onto whatever just started playing.
                if (episodeQueue !== queue) return@withContext
                player.addMediaItems(resolved)
            }
        }
    }

    /** The episode row with its stream URL filled in, or null when it has none. */
    private suspend fun resolveEpisode(mediaId: String): MediaItem? {
        val articleId = MediaItemTree.getArticleIdFromMediaId(mediaId) ?: return null
        val streamUrl = repository.getPodcastEpisodeInfo(articleId)?.streamUrl
        if (streamUrl.isNullOrEmpty()) {
            Log.w(TAG, "Queued episode $articleId has no stream URL")
            return null
        }
        return MediaItemTree.buildResolvedEpisodeItem(mediaId, streamUrl)
    }

    private fun resolveMediaItems(mediaItems: List<MediaItem>): MutableList<MediaItem> {
        val playlist = mutableListOf<MediaItem>()
        mediaItems.forEach { mediaItem ->
            if (mediaItem.mediaId.isNotEmpty()) {
                MediaItemTree.expandItem(mediaItem)?.let { playlist.add(it) }
            } else if (mediaItem.requestMetadata.searchQuery != null) {
                playlist.addAll(MediaItemTree.search(mediaItem.requestMetadata.searchQuery!!))
            }
        }
        return playable(playlist)
    }

    /**
     * Episode rows reach the player without a stream URI — voice search indexes them, and playing a
     * category browsable hands over its children wholesale. `DefaultMediaSourceFactory` throws on a
     * [MediaItem] with no `localConfiguration`, taking the service down, so they are dropped here
     * rather than queued.
     *
     * A single tapped episode never lands here: [onSetMediaItems] routes it to [startEpisodeQueue],
     * which resolves it first.
     */
    private fun playable(items: List<MediaItem>): MutableList<MediaItem> =
        items.filterTo(mutableListOf()) { it.localConfiguration != null }

    @OptIn(UnstableApi::class)
    private fun maybeExpandSingleItemToPlaylist(
        mediaItem: MediaItem,
        startIndex: Int,
        startPositionMs: Long,
    ): MediaSession.MediaItemsWithStartPosition? {
        var playlist = listOf<MediaItem>()
        var startsAtTappedItem = false
        MediaItemTree.getItem(mediaItem.mediaId)?.apply {
            if (mediaMetadata.isBrowsable == true) {
                // Get children browsable item.
                playlist = MediaItemTree.getChildren(mediaId)
            } else if (requestMetadata.searchQuery == null) {
                // Try to get the parent and its children.
                MediaItemTree.getParentId(mediaId)?.let {
                    playlist =
                        MediaItemTree.getChildren(it).map { mediaItem ->
                            if (mediaItem.mediaId == mediaId) MediaItemTree.expandItem(mediaItem)!! else mediaItem
                        }
                    startsAtTappedItem = true
                }
            }
        }
        // Filter before taking the index — dropping an unplayable row shifts every index after it.
        val queue = playable(playlist)
        if (queue.isEmpty()) return null
        return MediaSession.MediaItemsWithStartPosition(
            queue,
            if (startsAtTappedItem) {
                MediaItemTree.getIndexInMediaItems(mediaItem.mediaId, queue)
            } else {
                startIndex.coerceIn(0, queue.size - 1)
            },
            startPositionMs
        )
    }

    // Note: `onSearch` and `onGetSearchResult` were here. They answered the browse search box off
    // `MediaItemTree.search`, and both became unreachable when [onConnect] stopped granting the
    // library-search commands — the head unit no longer offers the box, and the legacy stub would
    // reject the call if it did. Restoring the button means restoring the commands *and* these two
    // overrides; `MediaItemTree.search` itself stays, because voice search still uses it.

    fun release() {
        stopHomeAutoRefresh()
        failedBrowses.values.forEach { it.cancel() }
        failedBrowses.clear()
        try {
            connectivityManager?.unregisterNetworkCallback(networkCallback)
        } catch (e: Exception) {
            // Never registered.
        }
        browseExecutor.shutdown()
    }

    companion object {
        private const val TAG = "LRTMediaSessionCallback"

        /** Resolved episodes kept queued beyond the one playing. */
        private const val EPISODE_LOOKAHEAD = 2

        /**
         * A failed browse is re-browsed every 5 s for five minutes. Past that only a returning
         * network, or the driver opening it again, retries it.
         */
        private const val BROWSE_RETRY_INTERVAL_MS = 5_000L
        private const val BROWSE_RETRY_ATTEMPTS = 60
    }
}
