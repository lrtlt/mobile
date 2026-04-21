package lt.mediapark.lrt.auto.data

import com.google.gson.annotations.SerializedName

data class WatchHistoryEntry(
    @SerializedName("articleId"   ) val articleId   : Int,
    @SerializedName("mediaType"   ) val mediaType   : String,
    @SerializedName("category_id" ) val categoryId  : Int? = null,
    @SerializedName("positionSec" ) val positionSec : Int,
    @SerializedName("durationSec" ) val durationSec : Int,
    @SerializedName("progressPct" ) val progressPct : Double,
    @SerializedName("completed"   ) val completed   : Boolean,
    @SerializedName("updatedAt"   ) val updatedAt   : Long
)

data class WatchHistoryResponse(
    @SerializedName("list") val list: List<WatchHistoryEntry> = emptyList()
)

data class WatchHistoryPushRequest(
    @SerializedName("list") val list: List<WatchHistoryEntry>
)
