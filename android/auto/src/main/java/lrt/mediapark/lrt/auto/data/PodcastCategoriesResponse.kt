package lrt.mediapark.lrt.auto.data

import com.google.gson.annotations.SerializedName

data class PodcastCategoriesResponse(
    @SerializedName("total_found") val total: Int? = null,
    @SerializedName("items"      ) val items: List<PodcastCategory>? = null
)

data class PodcastCategory(
    @SerializedName("title"     ) val title     : String? = null,
    @SerializedName("id"        ) val id   : Int? = null,
)

data class PodcastEpisodesResponse(
    @SerializedName("next_page"     ) val nextPage: Int? = null,
    @SerializedName("page"          ) val page: Int? = null,
    @SerializedName("articles"      ) val items: List<PodcastEpisode>? = null
)

data class PodcastEpisode(
    @SerializedName("title"             ) val title     : String? = null,
    @SerializedName("id"                ) val id   : Int? = null,
    @SerializedName("img_path_prefix"   ) val imgPathPrefix     : String? = null,
    @SerializedName("img_path_postfix"  ) val imgPathPostfix  : String? = null,
    @SerializedName("media_duration_sec") val durationSeconds : Int? = null
)

data class PodcastEpisodeInfoResponse(
    @SerializedName("article"   ) val info   : PodcastEpisodeInfo? = null
)

data class PodcastEpisodeInfo(
    @SerializedName("id"        ) val id   : Int? = null,
    @SerializedName("stream_url") val streamUrl : String? = null
)