package lt.mediapark.lrt.auto.data

import com.google.gson.annotations.SerializedName

data class SubscriptionsResponse(
    val subscriptions: List<UserSubscription>
)

data class UserSubscription(
    @SerializedName("subscription_key") val subscriptionKey: String,
    @SerializedName("is_active") val isActive: Boolean,
    @SerializedName("name") val name: String?
)
