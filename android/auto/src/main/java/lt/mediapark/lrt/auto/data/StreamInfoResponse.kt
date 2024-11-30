package lt.mediapark.lrt.auto.data

import com.google.gson.annotations.SerializedName

data class StreamInfoResponse(
    @SerializedName("response") var response: StreamInfoData? = null
)

data class StreamInfoData(
    @SerializedName("data") var streamInfo: StreamInfo? = null
)

data class StreamInfo(
    @SerializedName("content"     ) var content     : String? = null,
    @SerializedName("content2"    ) var content2   : String? = null,
    @SerializedName("audio"       ) var audio     : String? = null,
    @SerializedName("restriction" ) var restriction : String? = null
)
