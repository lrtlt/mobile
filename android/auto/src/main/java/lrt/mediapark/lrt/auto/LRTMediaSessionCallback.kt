package lrt.mediapark.lrt.auto

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
import kotlinx.coroutines.runBlocking
import lrt.mediapark.lrt.auto.data.LRTAutoRepository
import lrt.mediapark.lrt.auto.data.LRTAutoService
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LRTMediaSessionCallback: MediaLibraryService.MediaLibrarySession.Callback  {

    private val repository: LRTAutoRepository

    init {
        val retrofit: Retrofit = Retrofit.Builder()
            .baseUrl("https://lrt.lt/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        val service: LRTAutoService = retrofit.create(LRTAutoService::class.java)
        repository = LRTAutoRepository(service)
        MediaItemTree.initialize()
    }

    override fun onConnect(
        mediaSession: MediaSession,
        controller: MediaSession.ControllerInfo
    ): MediaSession.ConnectionResult {
        Log.d(TAG, "onConnect() called")
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

    @OptIn(UnstableApi::class) override fun onGetChildren(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        parentId: String,
        page: Int,
        pageSize: Int,
        params: LibraryParams?
    ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> {
        if (parentId == MediaItemTree.RECOMMENDED) {
            runBlocking {
                val recommendedItems = repository.getRecommended()
                MediaItemTree.setRecommendedItems(recommendedItems)
            }
        }

        if (parentId == MediaItemTree.NEWEST) {
            runBlocking {
                val newestItems = repository.getNewest()
                MediaItemTree.setNewestItems(newestItems)
            }
        }

        if (parentId == MediaItemTree.LIVE) {
            runBlocking {
                val liveItems = repository.getLive()
                MediaItemTree.setLiveItems(liveItems)
            }
        }

        if(parentId == MediaItemTree.PODCAST_CATEGORIES) {
            runBlocking {
                val podcastCategories = repository.getPodcastCategories()
                MediaItemTree.setPodcastCategories(podcastCategories)
            }
        }

        MediaItemTree.getPodcastCategoryId(parentId).let {
            if(it > 0) {
                runBlocking {
                    val podcastItems = repository.getPodcastEpisodes(it)
                    MediaItemTree.setPodcastEpisodes(it, podcastItems)
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
                    val podcastEpisodeInfo = runBlocking {
                         repository.getPodcastEpisodeInfo(it)
                    }
                    if(podcastEpisodeInfo?.streamUrl != null) {
                        val episodeMediaItem = MediaItemTree.buildPodcastEpisodeItem(
                            item.mediaId,
                            podcastEpisodeInfo.streamUrl
                        )
                        return Futures.immediateFuture(
                            MediaSession.MediaItemsWithStartPosition(
                                listOf(episodeMediaItem),
                                startIndex,
                                startPositionMs
                            )
                        )
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