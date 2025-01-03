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

    suspend fun getNewest() = withContext(Dispatchers.IO) {
        if (System.currentTimeMillis() - newestLastFetchTime > CACHE_DURATION || newest.isEmpty()) {
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
                    .map { api.getStreamInfo(it.streamUrl!!) }
                    .map { it.response?.streamInfo }
                    .mapIndexedNotNull{
                            index, streamInfo -> PlaylistItem(
                        title = if (streamInfo?.restriction.isNullOrEmpty()) programItems[index].channelTitle else BLOCKED_STREAM_MESSAGE,
                        content = programItems[index].title,
                        cover = getCoverByChannelId(programItems[index]),
                        streamUrl = streamInfo?.audio ?: streamInfo?.content ?: ""
                    )
                    }
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
        val contentDir = "content://androidx.media3/"
        return when (programItem.channelId) {
            "1" -> "${contentDir}ic_tv.png"
            "2" -> "${contentDir}ic_plius.png"
            "3" -> "${contentDir}ic_lituanica.png"
            "5" -> "${contentDir}ic_klasika.png"
            "6" -> "${contentDir}ic_opus.png"
            else -> "${contentDir}ic_radijas.png"
        }
    }

    companion object {
        private const val BLOCKED_STREAM_MESSAGE = "Transliacija internetu negalima"
        private const val CACHE_DURATION = 5 * 60 * 1000L // 5 minutes
        private const val PODCAST_CACHE_DURATION = 4 * 60 * 60 * 1000L // 4 hours
    }
}
