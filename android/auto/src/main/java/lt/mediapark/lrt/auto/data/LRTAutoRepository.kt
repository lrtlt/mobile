package lt.mediapark.lrt.auto.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class LRTAutoRepository(private val api: LRTAutoService) {

    private var recommendedLastFetchTime: Long = 0
    private var recommended: List<PlaylistItem> = emptyList()

    private var newestLastFetchTime: Long = 0
    private var newest: List<PlaylistItem> = emptyList()

    private var liveLastFetchTime: Long = 0
    private var live: List<PlaylistItem> = emptyList()

    private var podcastCategoriesLastFetchTime: Long = 0
    private var podcastCategories: List<PodcastCategory> = emptyList()

    suspend fun getRecommended() = withContext(Dispatchers.IO) {
        if (System.currentTimeMillis() - recommendedLastFetchTime > CACHE_DURATION || recommended.isEmpty()) {
            try{
                recommended = api.getRecommendedPlaylist().filter { it.streamUrl != null }
                if (recommended.isNotEmpty()) {
                    recommendedLastFetchTime = System.currentTimeMillis()
                }
            }catch (e: Exception) {
                e.printStackTrace()
            }
        }
        recommended
    }

    suspend fun getNewest(forceRefresh: Boolean = false) = withContext(Dispatchers.IO) {
        if (forceRefresh || System.currentTimeMillis() - newestLastFetchTime > NEWEST_CACHE_DURATION || newest.isEmpty()) {
            try{
                newest = api.getNewestPlaylist().filter { it.streamUrl != null }
                if (newest.isNotEmpty()){
                    newestLastFetchTime = System.currentTimeMillis()
                }
            }catch (e: Exception) {
                e.printStackTrace()
            }
        }
        newest
    }

    suspend fun getLive() = withContext(Dispatchers.IO) {
        if (System.currentTimeMillis() - liveLastFetchTime > CACHE_DURATION || live.isEmpty()) {
            try{
                val programItems = api.getLivePlaylist().program?.items ?: emptyList()
                live = programItems
                    .filter { it.streamUrl != null }
                    .map { programItem ->
                        Pair(programItem, api.getStreamInfo(programItem.streamUrl!!).response?.streamInfo)
                    }
                    .mapNotNull { (programItem, streamInfo) ->
                        Pair(
                            programItem.channelId,
                            PlaylistItem(
                                title = if (streamInfo?.restriction.isNullOrEmpty()) programItem.channelTitle else BLOCKED_STREAM_MESSAGE,
                                content = programItem.title,
                                cover = getCoverByChannelId(programItem),
                                streamUrl = if (streamInfo?.restriction.isNullOrEmpty()) streamInfo?.audio ?: streamInfo?.content ?: "" else BLOCKED_STREAM_URL,
                            )
                        )
                    }
                    .sortedBy { (channelId, _) ->
                        when(channelId) {
                            "4" -> 0
                            "37" -> 1
                            "5" -> 2
                            "6" -> 3
                            "1" -> 4
                            "2" -> 5
                            "3" -> 6
                            else -> 7
                        }
                    }
                    .map { (_, playlistItem) -> playlistItem }
                if(live.isNotEmpty()){
                    liveLastFetchTime = System.currentTimeMillis()
                }
            }catch (e: Exception) {
                e.printStackTrace()
            }
        }
        live
    }

    suspend fun getPodcastCategories() = withContext(Dispatchers.IO) {
        if (System.currentTimeMillis() - podcastCategoriesLastFetchTime > PODCAST_CACHE_DURATION || podcastCategories.isEmpty()) {
            try {
                podcastCategories = api.getPodcastCategories(1000).items ?: emptyList()
                if(podcastCategories.isNotEmpty()){
                    podcastCategoriesLastFetchTime = System.currentTimeMillis()
                }
            }catch (e: Exception) {
                e.printStackTrace()
            }
        }
        podcastCategories
    }

    suspend fun getPodcastEpisodes(categoryId: Int) = withContext(Dispatchers.IO) {
        var items: List<PodcastEpisode> = emptyList()
        try {
            items = api.getPodcastEpisodes(categoryId).items ?: emptyList()
        }catch (e: Exception) {
            e.printStackTrace()
        }
        items
    }

    suspend fun getPodcastEpisodeInfo(id: Int) = withContext(Dispatchers.IO) {
        var result: PodcastEpisodeInfo? = null
        try{
            result = api.getPodcastEpisodeInfo(id)?.info
        }catch (e: Exception){
            e.printStackTrace()
        }
        result
    }

    private fun getCoverByChannelId(programItem: TvProgramItem): String {
        return when (programItem.channelId) {
            "1" -> "https://www.lrt.lt/images/app_logo/LTV1.png?v=2"
            "2" -> "https://www.lrt.lt/images/app_logo/LTV2.png?v=2"
            "3" -> "https://www.lrt.lt/images/app_logo/WORLD.png?v=2"
            "5" -> "https://www.lrt.lt/images/app_logo/Klasika.png?v=2"
            "6" -> "https://www.lrt.lt/images/app_logo/Opus.png?v=2"
            "37" -> "https://www.lrt.lt/images/app_logo/LRT100.png?v=2"
            else -> "https://www.lrt.lt/images/app_logo/LR.png?v=2"
        }
    }

    companion object {
        private const val BLOCKED_STREAM_MESSAGE = "Transliacija internetu negalima"
        private const val BLOCKED_STREAM_URL = "https://stream-vod3.lrt.lt/AUDIO/Block/tikLT.m4a/playlist.m3u8"
        private const val CACHE_DURATION = 5 * 60 * 1000L // 5 minutes
        private const val NEWEST_CACHE_DURATION = 2 * 60 * 1000L // 2 minutes
        private const val PODCAST_CACHE_DURATION = 4 * 60 * 60 * 1000L // 4 hours
    }
}
