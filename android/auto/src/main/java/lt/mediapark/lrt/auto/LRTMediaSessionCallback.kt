package lt.mediapark.lrt.auto

import android.util.Log
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.LibraryResult
import androidx.media3.session.MediaLibraryService
import androidx.media3.session.MediaLibraryService.LibraryParams
import androidx.media3.session.MediaSession
import androidx.media3.session.SessionError
import com.google.common.collect.ImmutableList
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.ktx.Firebase
import java.util.concurrent.Callable
import java.util.concurrent.Executors
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import lt.mediapark.lrt.auto.data.LRTAutoRepository
import lt.mediapark.lrt.auto.data.LRTAutoService
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LRTMediaSessionCallback: MediaLibraryService.MediaLibrarySession.Callback  {

    private val repository: LRTAutoRepository
    private val scope = CoroutineScope(Dispatchers.Default)
    private var newestRefreshJob: Job? = null
    private var currentSession: MediaLibraryService.MediaLibrarySession? = null

    init {
        val retrofit: Retrofit = Retrofit.Builder()
            .baseUrl("https://lrt.lt/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        val service: LRTAutoService = retrofit.create(LRTAutoService::class.java)
        repository = LRTAutoRepository(service)
        MediaItemTree.initialize()
    }

    private fun startNewestAutoRefresh(session: MediaLibraryService.MediaLibrarySession) {
        stopNewestAutoRefresh()
        currentSession = session
        newestRefreshJob = scope.launch {
            while (true) {
                delay(2 * 60 * 1000L) // 2 minutes
                try {
                    val newestItems = repository.getNewest(forceRefresh = true)
                    MediaItemTree.setNewestItems(newestItems)
                    session.notifyChildrenChanged(
                        MediaItemTree.NEWEST,
                        MediaItemTree.getChildren(MediaItemTree.NEWEST).size,
                        null
                    )
                    Log.d(TAG, "Auto-refreshed newest items")
                } catch (e: Exception) {
                    Log.e(TAG, "Error auto-refreshing newest items", e)
                }
            }
        }
    }

    private fun stopNewestAutoRefresh() {
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
            Firebase.analytics.logEvent(event, null)
        }catch (e: Exception){
            //
        }
    }

    override fun onConnect(
        mediaSession: MediaSession,
        controller: MediaSession.ControllerInfo
    ): MediaSession.ConnectionResult {
        logAnalyticsEvent(controller.packageName, "android_auto_connected")
        return super.onConnect(mediaSession, controller)
    }

    override fun onGetLibraryRoot(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        params: LibraryParams?
    ): ListenableFuture<LibraryResult<MediaItem>> {
        return Futures.immediateFuture(LibraryResult.ofItem(MediaItemTree.getRootItem(), params))
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
        }, Executors.newSingleThreadExecutor())
    }

    @OptIn(UnstableApi::class) override fun onGetChildren(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        parentId: String,
        page: Int,
        pageSize: Int,
        params: LibraryParams?
    ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> {

        if (parentId == MediaItemTree.RECOMMENDED) {
            logAnalyticsEvent(browser.packageName, "android_auto_recommended_open")
            return submitBlocking {
                val recommendedItems = repository.getRecommended()
                MediaItemTree.setRecommendedItems(recommendedItems)
                LibraryResult.ofItemList(MediaItemTree.getChildren(parentId), params)
            }
        }

        if (parentId == MediaItemTree.NEWEST) {
            logAnalyticsEvent(browser.packageName, "android_auto_newest_open")
            startNewestAutoRefresh(session)
            return submitBlocking {
                val newestItems = repository.getNewest(forceRefresh = true)
                MediaItemTree.setNewestItems(newestItems)
                LibraryResult.ofItemList(MediaItemTree.getChildren(parentId), params)
            }
        }

        if (parentId == MediaItemTree.LIVE) {
            logAnalyticsEvent(browser.packageName, "android_auto_live_open")
            return submitBlocking {
                val liveItems = repository.getLive()
                MediaItemTree.setLiveItems(liveItems)
                LibraryResult.ofItemList(MediaItemTree.getChildren(parentId), params)
            }
        }

        if(parentId == MediaItemTree.PODCAST_CATEGORIES) {
            logAnalyticsEvent(browser.packageName, "android_auto_podcasts_open")
            return submitBlocking {
                val podcastCategories = repository.getPodcastCategories()
                MediaItemTree.setPodcastCategories(podcastCategories)
                LibraryResult.ofItemList(MediaItemTree.getChildren(parentId), params)
            }
        }

        MediaItemTree.getPodcastCategoryId(parentId).let {
            if(it > 0) {
                return submitBlocking {
                    val podcastItems = repository.getPodcastEpisodes(it)
                    MediaItemTree.setPodcastEpisodes(it, podcastItems)
                    LibraryResult.ofItemList(MediaItemTree.getChildren(parentId), params)
                }
            }
        }

        val children = MediaItemTree.getChildren(parentId)
        if (children.isNotEmpty()) {
            return Futures.immediateFuture(LibraryResult.ofItemList(children, params))
        }
        return Futures.immediateFuture(LibraryResult.ofError(SessionError.ERROR_BAD_VALUE))
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
        if (mediaItems.size == 1) {
            val item = mediaItems.first()

            MediaItemTree.getPodcastEpisodeId(item.mediaId).let {
                if(it > 0) {
                    return submitBlocking {
                            val podcastEpisodeInfo = repository.getPodcastEpisodeInfo(it)
                            if(podcastEpisodeInfo?.streamUrl != null) {
                                val episodeMediaItem = MediaItemTree.buildPodcastEpisodeItem(
                                    item.mediaId,
                                    podcastEpisodeInfo.streamUrl
                                )
                                MediaSession.MediaItemsWithStartPosition(
                                    listOf(episodeMediaItem),
                                    startIndex,
                                    startPositionMs
                                )
                            } else {
                                MediaSession.MediaItemsWithStartPosition(
                                    resolveMediaItems(mediaItems),
                                    startIndex,
                                    startPositionMs
                                )
                            }

                    }
                }
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

    private fun resolveMediaItems(mediaItems: List<MediaItem>): MutableList<MediaItem> {
        val playlist = mutableListOf<MediaItem>()
        mediaItems.forEach { mediaItem ->
            if (mediaItem.mediaId.isNotEmpty()) {
                MediaItemTree.expandItem(mediaItem)?.let { playlist.add(it) }
            } else if (mediaItem.requestMetadata.searchQuery != null) {
                playlist.addAll(MediaItemTree.search(mediaItem.requestMetadata.searchQuery!!))
            }
        }
        return playlist
    }

    @OptIn(UnstableApi::class)
    private fun maybeExpandSingleItemToPlaylist(
        mediaItem: MediaItem,
        startIndex: Int,
        startPositionMs: Long,
    ): MediaSession.MediaItemsWithStartPosition? {
        var playlist = listOf<MediaItem>()
        var indexInPlaylist = startIndex
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
                    indexInPlaylist = MediaItemTree.getIndexInMediaItems(mediaId, playlist)
                }
            }
        }
        if (playlist.isNotEmpty()) {
            return MediaSession.MediaItemsWithStartPosition(
                playlist,
                indexInPlaylist,
                startPositionMs
            )
        }
        return null
    }

    override fun onSearch(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        query: String,
        params: LibraryParams?,
    ): ListenableFuture<LibraryResult<Void>> {
        session.notifySearchResultChanged(browser, query, MediaItemTree.search(query).size, params)
        return Futures.immediateFuture(LibraryResult.ofVoid())
    }

    override fun onGetSearchResult(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        query: String,
        page: Int,
        pageSize: Int,
        params: LibraryParams?,
    ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> {
        return Futures.immediateFuture(LibraryResult.ofItemList(MediaItemTree.search(query), params))
    }

    companion object {
        private const val TAG = "LRTMediaSessionCallback"
    }
}
