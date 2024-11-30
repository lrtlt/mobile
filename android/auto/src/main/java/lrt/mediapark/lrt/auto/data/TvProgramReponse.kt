package lrt.mediapark.lrt.auto.data

import com.google.gson.annotations.SerializedName

data class TvProgramResponse (
    @SerializedName("tvprog" ) var program : TvProgram? = TvProgram()
)

data class TvProgram (
    @SerializedName("items"         ) var items     : ArrayList<TvProgramItem> = arrayListOf(),
)

data class TvProgramItem (
    @SerializedName("stream_url"    ) var streamUrl     : String? = null,
    @SerializedName("cover_url"     ) var cover     : String? = null,
    @SerializedName("channel_id"    ) var channelId   : String? = null,
    @SerializedName("channel_title" ) var channelTitle : String? = null,
    @SerializedName("title"         ) var title : String? = null
)