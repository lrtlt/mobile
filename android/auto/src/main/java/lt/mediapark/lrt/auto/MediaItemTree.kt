package lt.mediapark.lrt.auto

import android.net.Uri
import android.os.Bundle
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaItem.SubtitleConfiguration
import androidx.media3.common.MediaMetadata
import androidx.media3.common.util.UnstableApi
import com.google.common.collect.ImmutableList
import lt.mediapark.lrt.auto.data.PlaylistItem
import lt.mediapark.lrt.auto.data.PodcastCategory
import lt.mediapark.lrt.auto.data.PodcastEpisode
import lt.mediapark.lrt.auto.data.UserSubscription

object MediaItemTree {
    private var treeNodes: MutableMap<String, MediaItemNode> = mutableMapOf()
    private var titleMap: MutableMap<String, MediaItemNode> = mutableMapOf()
    private var isInitialized = false

    const val ROOT = "[root]"

    /**
     * The landing browsable. Its media ID keeps the value it had when this node held only the
     * recommendations, because Android Auto caches browse trees against media IDs and the
     * analytics event is keyed off it — the same reason CarPlay kept the tab title as identity.
     */
    const val HOME = "[recommended]"
    const val LIVE = "[live]"
    const val PODCAST_CATEGORIES = "[podcast_categories]"
    const val MANO_LRT = "[mano_lrt]"

    /** The full newest feed, behind Home's `Naujausi` group. No longer a root browsable. */
    const val NEWEST_ALL = "[newest]"

    /** The full recommendations feed, behind Home's `Siūlome` group. Never a root browsable. */
    const val RECOMMENDED_ALL = "[recommended_all]"

    private const val PODCAST_PREFIX = "[podcast]"
    private const val PODCAST_EPISODE_PREFIX = "[podcast_episode]"
    private const val SUBSCRIPTION_PREFIX = "[subscription]"
    private const val SUBSCRIPTION_EPISODE_PREFIX = "[subscription_episode]"
    private const val RECOMMENDED_ITEM_PREFIX = "[recommended_item]"
    private const val RECOMMENDED_ALL_ITEM_PREFIX = "[recommended_all_item]"
    private const val NEWEST_ITEM_PREFIX = "[newest_item]"
    private const val NEWEST_ALL_ITEM_PREFIX = "[newest_all_item]"
    private const val LIVE_ITEM_PREFIX = "[live_item]"
    private const val EPISODE_IMAGE_SIZE = "282x158"

    const val EXTRA_CHANNEL_ID = "channel_id"
    const val EXTRA_ARTICLE_ID = "article_id"
    const val EXTRA_START_POSITION_SEC = "start_position_sec"

    /**
     * The browsable this item hangs off, and the group within it. Together they are what the
     * up-next rule needs: tapping a row queues the items sharing both, which is "the section you
     * tapped in becomes the playlist" expressed against a browse tree rather than a list template.
     *
     * Stored rather than derived, because Home now mixes three groups under one parent and
     * walking back up with [getParentId] would hand back all of them.
     */
    private const val EXTRA_PARENT_ID = "parent_id"
    private const val EXTRA_SECTION_ID = "section_id"

    private const val SECTION_CONTINUE_PLAYING = "continue_playing"
    private const val SECTION_RECOMMENDED = "recommended"
    private const val SECTION_NEWEST = "newest"
    private const val SECTION_LIVE = "live"
    private const val SECTION_EPISODES = "episodes"
    private const val SECTION_SUBSCRIPTIONS = "subscriptions"

    /** Continue-playing rows shown inline. The rest are behind `Daugiau`. */
    private const val CONTINUE_PLAYING_VISIBLE_COUNT = 3

    /**
     * Rows in Home's `Siūlome` and `Naujausi` groups, matching CarPlay's cap. Both are lists like
     * `Klausykite toliau` above them, and everything past the cap is behind that group's `Daugiau`
     * folder — for `Naujausi` the feed returns far more, so the folder is there in practice.
     */
    private const val HOME_SECTION_VISIBLE_COUNT = 4

    /**
     * The logged-out `Mano LRT` copy, split across the row's two slots and byte-identical to
     * CarPlay's `loggedOutTitle` / `loggedOutSubtitle`.
     *
     * Sized against what was measured in a car: this row's title wraps to two lines and ellipsizes
     * near 86 characters, and CarPlay's empty-view title is one line of about 35 — so CarPlay is
     * the binding constraint and 32 and 34 characters clear both. The subtitle slot was previously
     * unused; the row rendered a title alone.
     */
    private const val LOGGED_OUT_TITLE = "Prisijunkite LRT.lt programėlėje"

    private const val LOGGED_OUT_BODY = "Mėgaukitės dar patogesne patirtimi"

    private const val KEY_COMPLETION_PERCENTAGE =
        "android.media.extra.PLAYBACK_COMPLETION_PERCENTAGE"
    private const val KEY_GROUP_TITLE = "android.media.browse.CONTENT_STYLE_GROUP_TITLE_HINT"
    private const val KEY_SINGLE_ITEM_HINT = "android.media.browse.CONTENT_STYLE_SINGLE_ITEM_HINT"

    const val KEY_CONTENT_STYLE_SUPPORTED = "android.media.browse.CONTENT_STYLE_SUPPORTED"
    const val KEY_CONTENT_STYLE_BROWSABLE_HINT =
        "android.media.browse.CONTENT_STYLE_BROWSABLE_HINT"
    const val KEY_CONTENT_STYLE_PLAYABLE_HINT = "android.media.browse.CONTENT_STYLE_PLAYABLE_HINT"
    const val CONTENT_STYLE_LIST_ITEM = 1
    const val CONTENT_STYLE_GRID_ITEM = 2

    /**
     * `Klausykite toliau`'s ID space. The suffixes read `_home` because `Mano LRT` used to render
     * a second copy of the group and the two could not share item IDs — a media ID maps to exactly
     * one node in [treeNodes], and a node holds one child list. Home is the only host now; the IDs
     * keep their names because Android Auto caches browse trees against them.
     */
    private const val CONTINUE_ITEM_PREFIX = "[continue_home]"
    private const val CONTINUE_MORE_FOLDER = "[continue_more_home]"
    private const val CONTINUE_ALL_ITEM_PREFIX = "[continue_all_home]"

    /**
     * Nodes [MediaItemNode.clearChildren] detaches but never evicts from [treeNodes]. They are
     * re-attached conditionally — a `Daugiau` folder only exists when there is more to show — and
     * a browse landing on one after it was evicted would find nothing to populate.
     */
    private val permanentNodes: Set<String> = setOf(
        ROOT, HOME, LIVE, PODCAST_CATEGORIES, MANO_LRT, NEWEST_ALL, RECOMMENDED_ALL,
        CONTINUE_MORE_FOLDER,
    )

    private class MediaItemNode(val item: MediaItem) {
        val searchTitle = normalizeSearchText(item.mediaMetadata.title)
        val searchText =
            StringBuilder()
                .append(searchTitle)
                .append(" ")
                .append(normalizeSearchText(item.mediaMetadata.subtitle))
                .append(" ")
                .append(normalizeSearchText(item.mediaMetadata.artist))
                .append(" ")
                .append(normalizeSearchText(item.mediaMetadata.albumArtist))
                .append(" ")
                .append(normalizeSearchText(item.mediaMetadata.albumTitle))
                .toString()

        private val children: MutableList<MediaItem> = ArrayList()

        fun addChild(childID: String) {
            this.children.add(treeNodes[childID]!!.item)
        }

        fun clearChildren(){
            this.children.forEach {
                if (it.mediaId !in permanentNodes) treeNodes.remove(it.mediaId)
            }
            this.children.clear()
        }

        fun getChildren(): List<MediaItem> {
            return ImmutableList.copyOf(children)
        }
    }

    fun initialize() {
        if (isInitialized) return
        isInitialized = true

        treeNodes[ROOT] =
            MediaItemNode(
                buildMediaItem(
                    title = "Root Folder",
                    mediaId = ROOT,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_MIXED
                )
            )

        treeNodes[HOME] =
            MediaItemNode(
                buildMediaItem(
                    title = "Siūlome",
                    mediaId = HOME,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_NEWS
                )
            )

        treeNodes[LIVE] =
            MediaItemNode(
                buildMediaItem(
                    title = "Tiesiogiai",
                    mediaId = LIVE,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_TV_CHANNELS
                )
            )

        treeNodes[PODCAST_CATEGORIES] =
            MediaItemNode(
                buildMediaItem(
                    title = "Laidos",
                    mediaId = PODCAST_CATEGORIES,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_PODCASTS
                )
            )

        treeNodes[MANO_LRT] =
            MediaItemNode(
                buildMediaItem(
                    title = "Mano LRT",
                    mediaId = MANO_LRT,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_MIXED
                )
            )

        // Both feeds keep a node off the root: each is reached through its own Home group rather
        // than as a browsable of its own. The group-title extra is what keeps each `Daugiau` row
        // rendering under the group whose overflow it holds.
        treeNodes[RECOMMENDED_ALL] =
            MediaItemNode(
                buildMediaItem(
                    title = "Daugiau",
                    mediaId = RECOMMENDED_ALL,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_NEWS,
                    extras = Bundle().apply { putString(KEY_GROUP_TITLE, "Siūlome") }
                )
            )

        treeNodes[NEWEST_ALL] =
            MediaItemNode(
                buildMediaItem(
                    title = "Daugiau",
                    mediaId = NEWEST_ALL,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_NEWS,
                    extras = Bundle().apply { putString(KEY_GROUP_TITLE, "Naujausi") }
                )
            )

        treeNodes[ROOT]!!.addChild(HOME)
        treeNodes[ROOT]!!.addChild(LIVE)
        treeNodes[ROOT]!!.addChild(PODCAST_CATEGORIES)
        treeNodes[ROOT]!!.addChild(MANO_LRT)
    }

    /**
     * [title] is nullable because `Prenumeratos` tiles carry no text at all — see
     * [applyManoLRTSections]. Every other row names itself.
     */
    @OptIn(UnstableApi::class) private fun buildMediaItem(
        title: String?,
        mediaId: String,
        isPlayable: Boolean,
        isBrowsable: Boolean,
        mediaType: @MediaMetadata.MediaType Int,
        subtitleConfigurations: List<SubtitleConfiguration> = mutableListOf(),
        album: String? = null,
        artist: String? = null,
        subtitle: String? = null,
        genre: String? = null,
        sourceUri: Uri? = null,
        imageUri: Uri? = null,
        extras: Bundle? = null
    ): MediaItem {
        val metadata =
            MediaMetadata.Builder()
                .setAlbumTitle(album)
                .setTitle(title)
                .setSubtitle(subtitle)
                .setArtist(artist)
                .setGenre(genre)
                .setIsBrowsable(isBrowsable)
                .setIsPlayable(isPlayable)
                .setArtworkUri(imageUri)
                .setMediaType(mediaType)
                .setExtras(extras)
                .build()

        return MediaItem.Builder()
            .setMediaId(mediaId)
            .setSubtitleConfigurations(subtitleConfigurations)
            .setMediaMetadata(metadata)
            .setUri(sourceUri)
            .build()
    }

    /**
     * Extras every addressable row carries: where it hangs and which group it belongs to, plus the
     * optional group header and grid hint. [sectionSiblings] reads the first two back.
     */
    private fun rowExtras(
        parentId: String,
        sectionId: String,
        groupTitle: String? = null,
        asGrid: Boolean = false,
        build: Bundle.() -> Unit = {}
    ): Bundle = Bundle().apply {
        putString(EXTRA_PARENT_ID, parentId)
        putString(EXTRA_SECTION_ID, sectionId)
        if (groupTitle != null) putString(KEY_GROUP_TITLE, groupTitle)
        // Per-item override of the browsable's declared content style. `Prenumeratos` is the only
        // group that takes it now, drawing as cover tiles the way CarPlay's `.grid` row does.
        // Home's three groups are all lists — `Klausykite toliau` has to be, because a grid tile
        // has nowhere to put its progress bar, and `Siūlome` and `Naujausi` follow it.
        if (asGrid) putInt(KEY_SINGLE_ITEM_HINT, CONTENT_STYLE_GRID_ITEM)
        build()
    }

    // MARK: - Klausykite toliau

    private fun buildContinuePlayingItem(
        source: PlaylistItem,
        mediaId: String,
        parentId: String,
        groupTitle: String?
    ): MediaItem {
        val extras = rowExtras(parentId, SECTION_CONTINUE_PLAYING, groupTitle) {
            source.articleId?.let { id -> putInt(EXTRA_ARTICLE_ID, id) }
            source.startPositionSec?.let { pos -> putInt(EXTRA_START_POSITION_SEC, pos) }
            putDouble(KEY_COMPLETION_PERCENTAGE, (source.progressPct ?: 0.0).coerceIn(0.0, 1.0))
        }
        return buildMediaItem(
            title = source.title ?: "-",
            mediaId = mediaId,
            isPlayable = true,
            isBrowsable = false,
            subtitle = source.content,
            mediaType = MediaMetadata.MEDIA_TYPE_PODCAST_EPISODE,
            sourceUri = Uri.parse(source.streamUrl),
            imageUri = source.cover?.let(Uri::parse),
            extras = extras
        )
    }

    /**
     * Appends Home's `Klausykite toliau` group: up to [CONTINUE_PLAYING_VISIBLE_COUNT] rows and
     * a `Daugiau` folder holding the full list when there is more. Adds nothing at all when there
     * is nothing to continue, so `Siūlome` takes the top of the browsable.
     */
    private fun appendContinuePlaying(items: List<PlaylistItem>) {
        val parent = treeNodes[HOME] ?: return
        treeNodes[CONTINUE_MORE_FOLDER]?.clearChildren()

        items.take(CONTINUE_PLAYING_VISIBLE_COUNT).forEach {
            val mediaId = CONTINUE_ITEM_PREFIX + it.articleId
            treeNodes[mediaId] = MediaItemNode(
                buildContinuePlayingItem(it, mediaId, HOME, "Klausykite toliau")
            )
            parent.addChild(mediaId)
        }

        if (items.size <= CONTINUE_PLAYING_VISIBLE_COUNT) return

        val moreFolder = buildMediaItem(
            title = "Daugiau",
            mediaId = CONTINUE_MORE_FOLDER,
            isPlayable = false,
            isBrowsable = true,
            mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_MIXED,
            extras = rowExtras(HOME, SECTION_CONTINUE_PLAYING, "Klausykite toliau")
        )
        val moreNode = MediaItemNode(moreFolder)
        treeNodes[CONTINUE_MORE_FOLDER] = moreNode
        items.forEach {
            val mediaId = CONTINUE_ALL_ITEM_PREFIX + it.articleId
            treeNodes[mediaId] = MediaItemNode(
                buildContinuePlayingItem(it, mediaId, CONTINUE_MORE_FOLDER, groupTitle = null)
            )
            moreNode.addChild(mediaId)
        }
        parent.addChild(CONTINUE_MORE_FOLDER)
    }

    // MARK: - Siūlome (Home)

    /**
     * Home, in this order: `Klausykite toliau`, `Siūlome`, `Naujausi` — three groups of the same
     * shape, each a short list of rows over a `Daugiau` folder onto its full feed. Only the first
     * group is auth-dependent and it is simply absent when there is nothing to continue, so Home
     * renders for a logged-out driver.
     */
    fun applyHomeSections(
        continueItems: List<PlaylistItem>,
        recommendedItems: List<PlaylistItem>,
        newestItems: List<PlaylistItem>
    ) {
        val home = treeNodes[HOME] ?: return
        home.clearChildren()

        appendContinuePlaying(continueItems)
        appendFeedGroup(
            home, recommendedItems, RECOMMENDED_ITEM_PREFIX, SECTION_RECOMMENDED,
            "Siūlome", RECOMMENDED_ALL
        )
        appendFeedGroup(
            home, newestItems, NEWEST_ITEM_PREFIX, SECTION_NEWEST, "Naujausi", NEWEST_ALL
        )
    }

    /**
     * One of Home's two feed groups: the first [HOME_SECTION_VISIBLE_COUNT] items as rows, then
     * that group's `Daugiau` folder when the feed holds more. `Siūlome` is a short curated feed and
     * can legitimately fit whole, which is why the folder is attached conditionally rather than
     * always.
     *
     * Tapping a row queues the rows the group actually shows, not the whole feed — [sectionSiblings]
     * reads the queue off the browse tree, and the rest of the feed lives under the folder rather
     * than here. Tapping inside the folder queues the feed whole. This is the same rule
     * `Klausykite toliau` has always followed.
     */
    private fun appendFeedGroup(
        parent: MediaItemNode,
        items: List<PlaylistItem>,
        itemPrefix: String,
        sectionId: String,
        groupTitle: String,
        moreFolderId: String,
    ) {
        items.take(HOME_SECTION_VISIBLE_COUNT).forEach {
            val mediaId = itemPrefix + it.streamUrl
            treeNodes[mediaId] = MediaItemNode(
                buildFeedItem(it, mediaId, HOME, sectionId, groupTitle)
            )
            parent.addChild(mediaId)
            indexForSearch(it.title, mediaId)
        }

        if (items.size > HOME_SECTION_VISIBLE_COUNT) {
            parent.addChild(moreFolderId)
        }
    }

    /** The full recommendations feed behind `Siūlome`'s `Daugiau`, the shown rows included. */
    fun setRecommendedAllItems(items: List<PlaylistItem>) {
        setFeedFolderItems(RECOMMENDED_ALL, RECOMMENDED_ALL_ITEM_PREFIX, SECTION_RECOMMENDED, items)
    }

    /** The full newest feed behind `Naujausi`'s `Daugiau`, the shown rows included. */
    fun setNewestAllItems(items: List<PlaylistItem>) {
        setFeedFolderItems(NEWEST_ALL, NEWEST_ALL_ITEM_PREFIX, SECTION_NEWEST, items)
    }

    private fun setFeedFolderItems(
        folderId: String,
        itemPrefix: String,
        sectionId: String,
        items: List<PlaylistItem>
    ) {
        val node = treeNodes[folderId] ?: return
        node.clearChildren()
        items.forEach {
            val mediaId = itemPrefix + it.streamUrl
            treeNodes[mediaId] = MediaItemNode(
                buildFeedItem(it, mediaId, folderId, sectionId, groupTitle = null)
            )
            node.addChild(mediaId)
            indexForSearch(it.title, mediaId)
        }
    }

    private fun buildFeedItem(
        source: PlaylistItem,
        mediaId: String,
        parentId: String,
        sectionId: String,
        groupTitle: String?
    ): MediaItem {
        val extras = rowExtras(parentId, sectionId, groupTitle) {
            source.articleId?.let { id -> putInt(EXTRA_ARTICLE_ID, id) }
        }
        return buildMediaItem(
            title = source.title ?: "-",
            mediaId = mediaId,
            isPlayable = true,
            isBrowsable = false,
            subtitle = source.content,
            mediaType = MediaMetadata.MEDIA_TYPE_NEWS,
            sourceUri = Uri.parse(source.streamUrl),
            imageUri = source.cover?.let(Uri::parse),
            extras = extras
        )
    }

    // MARK: - Tiesiogiai

    fun setLiveItems(items: List<PlaylistItem>){
        val node = treeNodes[LIVE] ?: return
        node.clearChildren()
        items.forEach {
            val mediaId = LIVE_ITEM_PREFIX + it.streamUrl
            val extras = rowExtras(LIVE, SECTION_LIVE) {
                it.channelId?.let { id -> putInt(EXTRA_CHANNEL_ID, id) }
            }
            val item = buildMediaItem(
                title = it.title ?: "-",
                mediaId = mediaId,
                isPlayable = true,
                isBrowsable = false,
                subtitle = it.content,
                mediaType = MediaMetadata.MEDIA_TYPE_NEWS,
                sourceUri = Uri.parse(it.streamUrl),
                imageUri = it.cover?.let(Uri::parse),
                extras = extras
            )

            treeNodes[mediaId] = MediaItemNode(item)
            node.addChild(mediaId)
            indexForSearch(it.title, mediaId)
        }
    }

    // MARK: - Laidos

    /**
     * The A–Z podcast browse. No auth dependency, which is why `Mano LRT` needs no route into it —
     * podcasts stay reachable when logged out.
     */
    fun setPodcastCategories(items: List<PodcastCategory>){
        val node = treeNodes[PODCAST_CATEGORIES] ?: return
        node.clearChildren()
        items.forEach {
            val mediaId = PODCAST_PREFIX + it.id
            val item = buildMediaItem(
                title = it.title ?: "-",
                mediaId = mediaId,
                isPlayable = false,
                isBrowsable = true,
                mediaType = MediaMetadata.MEDIA_TYPE_PODCAST_EPISODE,
            )

            treeNodes[mediaId] = MediaItemNode(item)
            node.addChild(mediaId)
            indexForSearch(it.title, mediaId)
        }
    }

    fun setPodcastEpisodes(podcastId: Int, episodes: List<PodcastEpisode>){
        setEpisodes(PODCAST_PREFIX + podcastId, PODCAST_EPISODE_PREFIX, episodes)
    }

    fun setSubscriptionEpisodes(categoryId: Int, episodes: List<PodcastEpisode>) {
        setEpisodes(SUBSCRIPTION_PREFIX + categoryId, SUBSCRIPTION_EPISODE_PREFIX, episodes)
    }

    /**
     * Episode rows carry an article ID and no stream URI: the URI lives in the article payload, so
     * resolving a whole category up front would cost one request per row. `LRTMediaSessionCallback`
     * resolves them as playback reaches them.
     */
    private fun setEpisodes(parentId: String, prefix: String, episodes: List<PodcastEpisode>) {
        val node = treeNodes[parentId] ?: return
        node.clearChildren()
        episodes.forEach {
            val mediaId = prefix + it.id
            val extras = rowExtras(parentId, SECTION_EPISODES) {
                it.id?.let { id -> putInt(EXTRA_ARTICLE_ID, id) }
            }
            val item = buildMediaItem(
                title = it.title ?: "-",
                mediaId = mediaId,
                isPlayable = true,
                isBrowsable = false,
                mediaType = MediaMetadata.MEDIA_TYPE_PODCAST_EPISODE,
                imageUri = episodeCoverUri(it),
                extras = extras
            )
            treeNodes[mediaId] = MediaItemNode(item)
            node.addChild(mediaId)
            indexForSearch(it.title, mediaId)
        }
    }

    private fun episodeCoverUri(episode: PodcastEpisode): Uri? {
        val prefix = episode.imgPathPrefix ?: return null
        val postfix = episode.imgPathPostfix ?: return null
        return Uri.parse("https://lrt.lt$prefix$EPISODE_IMAGE_SIZE$postfix")
    }

    // MARK: - ManoLRT

    /**
     * `Mano LRT`: `Prenumeratos` as cover tiles and nothing else. `Klausykite toliau` used to sit
     * above it and now lives in Home alone. The group is conditional, so a signed-in driver with no
     * subscriptions sees an empty browsable — no copy has been decided for that state.
     *
     * [covers] is keyed by `subscriptionKey`: no subscription payload carries artwork, so each
     * tile borrows the cover of its category's newest episode. A subscription without one still
     * gets a tile — unlike CarPlay, where the grid is images and a gap would shift every index
     * after it, an Android browsable row simply renders without art.
     *
     * `Prenumeratos` tiles are **cover-only**: no title, no subtitle, matching what CarPlay's
     * `.grid` style draws. Android Auto has no flag for that, so the absence has to be the
     * metadata itself — a null title. Two consequences follow that CarPlay does not share:
     * a tile whose cover also failed to load is now blank rather than merely unlabelled, and the
     * episode list a tile pushes takes its header from this same title, so that screen loses its
     * name too. Nothing else reads it — these rows were never indexed for voice search, and
     * [setSubscriptionEpisodes] is keyed off the media ID.
     */
    fun applyManoLRTSections(
        subscriptions: List<UserSubscription>,
        covers: Map<String, String>
    ) {
        val node = treeNodes[MANO_LRT] ?: return
        node.clearChildren()

        subscriptions.forEach { subscription ->
            val categoryId = subscription.categoryId ?: return@forEach
            val mediaId = SUBSCRIPTION_PREFIX + categoryId
            val item = buildMediaItem(
                // Cover-only tiles: neither a title nor a subtitle is drawn.
                title = null,
                mediaId = mediaId,
                isPlayable = false,
                isBrowsable = true,
                mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_PODCASTS,
                imageUri = covers[subscription.subscriptionKey]?.let(Uri::parse),
                extras = rowExtras(
                    MANO_LRT, SECTION_SUBSCRIPTIONS, "Prenumeratos", asGrid = true
                )
            )
            treeNodes[mediaId] = MediaItemNode(item)
            node.addChild(mediaId)
        }
    }

    /**
     * The logged-out `Mano LRT`: this message and nothing else. Podcasts remain fully reachable
     * through `Laidos`, so signing out costs only `Prenumeratos` here and `Klausykite toliau` in
     * Home.
     *
     * The copy is a full paragraph and this is a browse row, which Android Auto ellipsizes to the
     * row's width — there is no variant mechanism to fall back through as there is on CarPlay, and
     * no documented character budget to write against. What actually shows has to be read off a
     * head unit.
     */
    fun setManoLRTLoggedOut() {
        val node = treeNodes[MANO_LRT] ?: return
        node.clearChildren()
        val mediaId = "[mano_lrt_login_message]"
        val item = buildMediaItem(
            title = LOGGED_OUT_TITLE,
            subtitle = LOGGED_OUT_BODY,
            mediaId = mediaId,
            isPlayable = false,
            isBrowsable = false,
            mediaType = MediaMetadata.MEDIA_TYPE_MIXED
        )
        treeNodes[mediaId] = MediaItemNode(item)
        node.addChild(mediaId)
    }

    // MARK: - Up-next queue

    /**
     * The rows that share both a parent and a group with [mediaId] — the queue a tap should
     * install, per the one up-next rule. Folder rows (`Daugiau`) are excluded because they are not
     * playable, so they can never shift the start index.
     *
     * Empty when the item is unknown or carries no group, which leaves the caller on its fallback.
     */
    fun sectionSiblings(mediaId: String): List<MediaItem> {
        val extras = treeNodes[mediaId]?.item?.mediaMetadata?.extras ?: return emptyList()
        val parentId = extras.getString(EXTRA_PARENT_ID) ?: return emptyList()
        val sectionId = extras.getString(EXTRA_SECTION_ID) ?: return emptyList()
        return getChildren(parentId).filter {
            it.mediaMetadata.isPlayable == true &&
                it.mediaMetadata.extras?.getString(EXTRA_SECTION_ID) == sectionId
        }
    }

    fun getStartPositionMs(mediaId: String): Long {
        val item = treeNodes[mediaId]?.item ?: return 0L
        val sec = item.mediaMetadata.extras?.getInt(EXTRA_START_POSITION_SEC, 0) ?: 0
        return sec.toLong() * 1000L
    }

    fun getArticleIdFromMediaId(mediaId: String): Int? {
        val item = treeNodes[mediaId]?.item ?: return null
        val id = item.mediaMetadata.extras?.getInt(EXTRA_ARTICLE_ID, -1) ?: -1
        return if (id > 0) id else null
    }

    fun isEpisodeItem(mediaId: String): Boolean =
        mediaId.startsWith(PODCAST_EPISODE_PREFIX) ||
                mediaId.startsWith(SUBSCRIPTION_EPISODE_PREFIX)

    /** The episode row with its stream URI filled in, for handing to the player. */
    fun buildResolvedEpisodeItem(mediaId: String, streamUrl: String): MediaItem? {
        val item = treeNodes[mediaId]?.item ?: return null
        return item.buildUpon().setUri(Uri.parse(streamUrl)).build()
    }

    fun getSubscriptionCategoryId(mediaId: String): Int {
        if (mediaId.startsWith(SUBSCRIPTION_PREFIX)) {
            return mediaId.substring(SUBSCRIPTION_PREFIX.length).toIntOrNull() ?: -1
        }
        return -1
    }

    fun getPodcastCategoryId(mediaId: String): Int {
        if (mediaId.startsWith(PODCAST_PREFIX)) {
            return mediaId.substring(PODCAST_PREFIX.length).toIntOrNull() ?: -1
        }
        return -1
    }

    fun getItem(id: String): MediaItem? {
        return treeNodes[id]?.item
    }

    fun expandItem(item: MediaItem): MediaItem? {
        val treeItem = getItem(item.mediaId) ?: return null
        @OptIn(UnstableApi::class) // MediaMetadata.populate
        val metadata = treeItem.mediaMetadata.buildUpon().populate(item.mediaMetadata).build()
        return item
            .buildUpon()
            .setMediaMetadata(metadata)
            .setSubtitleConfigurations(treeItem.localConfiguration?.subtitleConfigurations ?: listOf())
            .setUri(treeItem.localConfiguration?.uri)
            .build()
    }

    /**
     * Returns the media ID of the parent of the given media ID, or null if the media ID wasn't found.
     *
     * @param mediaId The media ID of which to search the parent.
     * @Param parentId The media ID of the media item to start the search from, or undefined to search
     *   from the top most node.
     */
    fun getParentId(mediaId: String, parentId: String = ROOT): String? {
        for (child in treeNodes[parentId]!!.getChildren()) {
            if (child.mediaId == mediaId) {
                return parentId
            } else if (child.mediaMetadata.isBrowsable == true) {
                val nextParentId = getParentId(mediaId, child.mediaId)
                if (nextParentId != null) {
                    return nextParentId
                }
            }
        }
        return null
    }

    /**
     * Returns the index of the [MediaItem] with the give media ID in the given list of items. If the
     * media ID wasn't found, 0 (zero) is returned.
     */
    fun getIndexInMediaItems(mediaId: String, mediaItems: List<MediaItem>): Int {
        for ((index, child) in mediaItems.withIndex()) {
            if (child.mediaId == mediaId) {
                return index
            }
        }
        return 0
    }

    /**
     * Tokenizes the query into a list of words with at least two letters and searches in the search
     * text of the [MediaItemNode].
     */
    fun search(query: String): List<MediaItem> {
        val matches: MutableList<MediaItem> = mutableListOf()
        val titleMatches: MutableList<MediaItem> = mutableListOf()
        val words = query.split(" ").map { it.trim().lowercase() }.filter { it.length > 1 }
        titleMap.keys.forEach { title ->
            val mediaItemNode = titleMap[title]!!
            for (word in words) {
                if (mediaItemNode.searchText.contains(word)) {
                    if (mediaItemNode.searchTitle.contains(query.lowercase())) {
                        titleMatches.add(mediaItemNode.item)
                    } else {
                        matches.add(mediaItemNode.item)
                    }
                    break
                }
            }
        }
        titleMatches.addAll(matches)
        return titleMatches
    }

    fun getRootItem(): MediaItem {
        return treeNodes[ROOT]!!.item
    }

    fun getChildren(id: String): List<MediaItem> {
        return treeNodes[id]?.getChildren() ?: listOf()
    }

    private fun indexForSearch(title: String?, mediaId: String) {
        val node = treeNodes[mediaId] ?: return
        title?.let { titleMap[it.lowercase()] = node }
    }

    private fun normalizeSearchText(text: CharSequence?): String {
        if (text.isNullOrEmpty() || text.trim().length == 1) {
            return ""
        }
        return "$text".trim().lowercase()
    }
}
