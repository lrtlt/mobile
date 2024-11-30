package lt.mediapark.lrt.auto.data

import com.google.gson.annotations.SerializedName


data class PlaylistItem (
    @SerializedName("title"     ) var title     : String? = null,
    @SerializedName("content"   ) var content   : String? = null,
    @SerializedName("cover"     ) var cover     : String? = null,
    @SerializedName("streamUrl" ) var streamUrl : String? = null
)