package lrt.mediapark.lrt.auto

import android.net.Uri
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaItem.SubtitleConfiguration
import androidx.media3.common.MediaMetadata
import androidx.media3.common.util.UnstableApi
import com.google.common.collect.ImmutableList
import lrt.mediapark.lrt.auto.data.PlaylistItem
import lrt.mediapark.lrt.auto.data.PodcastCategory
import lrt.mediapark.lrt.auto.data.PodcastEpisode

object MediaItemTree {
    private var treeNodes: MutableMap<String, MediaItemNode> = mutableMapOf()
    private var titleMap: MutableMap<String, MediaItemNode> = mutableMapOf()
    private var isInitialized = false

    private const val ROOT = "[root]"
    const val RECOMMENDED = "[recommended]"
    const val LIVE = "[live]"
    const val NEWEST = "[newest]"
    const val PODCAST_CATEGORIES = "[podcast_categories]"

    private const val ITEM_PREFIX = "[item]"
    private const val PODCAST_PREFIX = "[podcast]"
    private const val PODCAST_EPISODE_PREFIX = "[podcast_episode]"

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
                treeNodes.remove(it.mediaId)
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

        treeNodes[RECOMMENDED] =
            MediaItemNode(
                buildMediaItem(
                    title = "Siūlome",
                    mediaId = RECOMMENDED,
                    isPlayable = false,
                    isBrowsable = true,
                    mediaType = MediaMetadata.MEDIA_TYPE_FOLDER_NEWS
                )
            )

        treeNodes[NEWEST] =
            MediaItemNode(
                buildMediaItem(
                    title = "Naujausi",
                    mediaId = NEWEST,
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

        treeNodes[ROOT]!!.addChild(RECOMMENDED)
        treeNodes[ROOT]!!.addChild(NEWEST)
        treeNodes[ROOT]!!.addChild(LIVE)
        treeNodes[ROOT]!!.addChild(PODCAST_CATEGORIES)
    }

    @OptIn(UnstableApi::class) private fun buildMediaItem(
        title: String,
        mediaId: String,
        isPlayable: Boolean,
        isBrowsable: Boolean,
        mediaType: @MediaMetadata.MediaType Int,
        subtitleConfigurations: List<SubtitleConfiguration> = mutableListOf(),
        album: String? = null,
        artist: String? = null,
        genre: String? = null,
        sourceUri: Uri? = null,
        imageUri: Uri? = null
    ): MediaItem {
        val metadata =
            MediaMetadata.Builder()
                .setAlbumTitle(album)
                .setTitle(title)
                .setArtist(artist)
                .setGenre(genre)
                .setIsBrowsable(isBrowsable)
                .setIsPlayable(isPlayable)
                .setArtworkUri(imageUri)
                .setMediaType(mediaType)
                .build()

        return MediaItem.Builder()
            .setMediaId(mediaId)
            .setSubtitleConfigurations(subtitleConfigurations)
            .setMediaMetadata(metadata)
            .setUri(sourceUri)
            .build()
    }


    fun setRecommendedItems(items: List<PlaylistItem>){
        treeNodes[RECOMMENDED]!!.clearChildren()
        items.forEach {
            val mediaId = ITEM_PREFIX + it.streamUrl
            val item = buildMediaItem(
                title = it.title ?: "-",
                mediaId = mediaId,
                isPlayable = true,
                isBrowsable = false,
                mediaType = MediaMetadata.MEDIA_TYPE_NEWS,
                sourceUri = Uri.parse(it.streamUrl),
                imageUri = Uri.parse(it.cover)
            )
            treeNodes[mediaId] = MediaItemNode(item)
            treeNodes[RECOMMENDED]!!.addChild(mediaId)
            it.title?.let { t ->
                titleMap[t.lowercase()] = treeNodes[mediaId]!!
            }
        }
    }

    fun setNewestItems(items: List<PlaylistItem>){
        treeNodes[NEWEST]!!.clearChildren()
        items.forEach {
            val mediaId = ITEM_PREFIX + it.streamUrl
            val item = buildMediaItem(
                title = it.title ?: "-",
                mediaId = mediaId,
                isPlayable = true,
                isBrowsable = false,
                mediaType = MediaMetadata.MEDIA_TYPE_NEWS,
                sourceUri = Uri.parse(it.streamUrl),
                imageUri = Uri.parse(it.cover)
            )
            treeNodes[mediaId] = MediaItemNode(item)
            treeNodes[NEWEST]!!.addChild(mediaId)
            it.title?.let { t ->
                titleMap[t.lowercase()] = treeNodes[mediaId]!!
            }
        }
    }

    fun setLiveItems(items: List<PlaylistItem>){
        treeNodes[LIVE]!!.clearChildren()
        items.forEach {
            val mediaId = ITEM_PREFIX + it.streamUrl
            val item = buildMediaItem(
                title = it.title ?: "-",
                mediaId = mediaId,
                isPlayable = true,
                isBrowsable = false,
                mediaType = MediaMetadata.MEDIA_TYPE_NEWS,
                sourceUri = Uri.parse(it.streamUrl),
                imageUri = Uri.parse(it.cover)
            )

            treeNodes[mediaId] = MediaItemNode(item)
            treeNodes[LIVE]!!.addChild(mediaId)
            it.title?.let { t ->
                titleMap[t.lowercase()] = treeNodes[mediaId]!!
            }
        }
    }

    fun setPodcastCategories(items: List<PodcastCategory>){
        treeNodes[PODCAST_CATEGORIES]!!.clearChildren()
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
            treeNodes[PODCAST_CATEGORIES]!!.addChild(mediaId)
            it.title?.let { t ->
                titleMap[t.lowercase()] = treeNodes[mediaId]!!
            }
        }
    }

    fun setPodcastEpisodes(podcastId: Int, episodes: List<PodcastEpisode>){
        val imgSize = "282x158"
        val parentId = PODCAST_PREFIX + podcastId

        episodes.forEach {
            val mediaId = PODCAST_EPISODE_PREFIX + it.id
            val item = buildMediaItem(
                title = it.title ?: "-",
                mediaId = mediaId,
                isPlayable = true,
                isBrowsable = false,
                mediaType = MediaMetadata.MEDIA_TYPE_PODCAST_EPISODE,
                imageUri = Uri.parse("https://lrt.lt${it.imgPathPrefix}$imgSize${it.imgPathPostfix}")
            )
            treeNodes[mediaId] = MediaItemNode(item)
            treeNodes[parentId]?.addChild(mediaId)
            it.title?.let { t ->
                titleMap[t.lowercase()] = treeNodes[mediaId]!!
            }
        }
    }

    fun buildPodcastEpisodeItem(podcastEpisodeId: String, streamUrl: String): MediaItem {
        val item = treeNodes[podcastEpisodeId]?.item
        return item!!.buildUpon().setUri(Uri.parse(streamUrl)).build()
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

    fun getPodcastCategoryId(mediaId: String): Int {
        if(mediaId.startsWith(PODCAST_PREFIX)){
            return mediaId.substring(PODCAST_PREFIX.length).toInt()
        }
        return -1;
    }

    fun getPodcastEpisodeId(mediaId: String): Int {
        if(mediaId.startsWith(PODCAST_EPISODE_PREFIX)){
            return mediaId.substring(PODCAST_EPISODE_PREFIX.length).toInt()
        }
        return -1;
    }

    private fun normalizeSearchText(text: CharSequence?): String {
        if (text.isNullOrEmpty() || text.trim().length == 1) {
            return ""
        }
        return "$text".trim().lowercase()
    }
}