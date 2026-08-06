package lt.mediapark.lrt.auto.data

import com.google.gson.annotations.SerializedName

data class SubscriptionsResponse(
    val subscriptions: List<UserSubscription>
)

data class UserSubscription(
    @SerializedName("subscription_key") val subscriptionKey: String,
    @SerializedName("is_active") val isActive: Boolean,
    @SerializedName("name") val name: String?
) {
    /**
     * The podcast category this subscription points at, parsed out of the `category-<id>` key.
     * Null for any key that is not a category subscription, which the Mano LRT browse skips.
     */
    val categoryId: Int?
        get() = subscriptionKey.removePrefix("category-").toIntOrNull()
}
