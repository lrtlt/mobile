package lt.mediapark.lrt.auto.data

import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Url

interface LRTAutoService {
    @GET("static/carplay/rekomenduoja.json")
    suspend fun getRecommendedPlaylist(): List<PlaylistItem>

    @GET("static/carplay/naujausi.json")
    suspend fun getNewestPlaylist(): List<PlaylistItem>

    @GET("static/tvprog/tvprog.json")
    suspend fun getLivePlaylist(): TvProgramResponse

    @GET
    suspend fun getStreamInfo(@Url url: String): StreamInfoResponse

    @GET("api/json/search/categories?type=audio")
    suspend fun getPodcastCategories(@Query("count") count: Int): PodcastCategoriesResponse

    @GET("api/json/category")
    suspend fun getPodcastEpisodes(@Query("id") id: Int): PodcastEpisodesResponse

    @GET("api/json/article/{id}")
    suspend fun getPodcastEpisodeInfo(@Path("id") id: Int): PodcastEpisodeInfoResponse
}
