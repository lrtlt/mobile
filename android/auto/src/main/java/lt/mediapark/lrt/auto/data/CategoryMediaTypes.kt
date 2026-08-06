package lt.mediapark.lrt.auto.data

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Whether a show category publishes audio episodes (radioteka) or video ones (mediateka).
 */
enum class CategoryMediaType { AUDIO, VIDEO }

/**
 * Resolves a category id to its [CategoryMediaType].
 *
 * A subscription arrives as a bare `category-<id>` key with `is_active` and a display name and
 * nothing else — see [UserSubscription] — so a podcast subscription is indistinguishable from a
 * TV-show one until the id is resolved against the catalogue.
 * `api/json/search/categories?type=audio` is that catalogue: its ids are exactly the radioteka
 * set, it shares no id with the `type=video` set, and the two together cover every category, so
 * membership settles the type outright.
 *
 * Deliberately kept out of [LRTAutoRepository], which is a plain data source. The car needs only
 * one half of this today — [keepAudio] drops video subscriptions from `Prenumeratos`, because a
 * TV show has nothing to play in a car — but the classification itself is the reusable part and
 * the video half is expected back (labelling mixed lists, or a video section once the car UI has
 * somewhere to put one). That belongs here rather than inline at a call site.
 */
class CategoryMediaTypeResolver(private val api: LRTAutoService) {

    @Volatile
    private var audioCategoryIds: Set<Int>? = null

    @Volatile
    private var lastFetchTime: Long = 0

    /**
     * The type of [categoryId], or null when the catalogue could not be resolved — a failed fetch
     * with nothing cached, or a truncated response.
     *
     * Null means *not known*, never video. Callers must not fold it into the video case: hiding a
     * podcast the driver actually subscribed to is a worse failure than briefly showing a show
     * that turns out to be video.
     */
    suspend fun mediaTypeOf(categoryId: Int): CategoryMediaType? {
        val ids = audioCategoryIds() ?: return null
        return if (categoryId in ids) CategoryMediaType.AUDIO else CategoryMediaType.VIDEO
    }

    /**
     * [subscriptions] with the video ones removed.
     *
     * Fails open: an unresolvable catalogue returns the list untouched, on the same reasoning as
     * [mediaTypeOf]. Keys that are not category subscriptions ([UserSubscription.categoryId] null)
     * pass through — this filter only ever removes video, and the browse skips those on its own.
     */
    suspend fun keepAudio(subscriptions: List<UserSubscription>): List<UserSubscription> {
        if (subscriptions.isEmpty()) return subscriptions
        val ids = audioCategoryIds() ?: return subscriptions
        return subscriptions.filter { subscription ->
            val categoryId = subscription.categoryId ?: return@filter true
            categoryId in ids
        }
    }

    /**
     * The audio half of the catalogue, cached for [CACHE_DURATION]. Null when it has never been
     * resolved; a failed refresh keeps serving the previous set rather than dropping to null.
     */
    private suspend fun audioCategoryIds(): Set<Int>? = withContext(Dispatchers.IO) {
        val cached = audioCategoryIds
        if (cached != null && System.currentTimeMillis() - lastFetchTime <= CACHE_DURATION) {
            return@withContext cached
        }
        try {
            // Same endpoint the `Laidos` browse lists podcasts from, asked for wholesale.
            val response = api.getPodcastCategories(CATALOGUE_COUNT)
            val items = response.items ?: emptyList()
            val total = response.total
            // `count` truncates silently — `total_found` reports the real size while `items`
            // holds only the first `count`. A short list would classify every missing podcast as
            // video, so it is rejected outright rather than half-applied.
            if (total != null && items.size < total) {
                Log.w(TAG, "Audio catalogue truncated: ${items.size} of $total, not classifying")
                return@withContext cached
            }
            val ids = items.mapNotNull { it.id }.toSet()
            if (ids.isEmpty()) return@withContext cached
            audioCategoryIds = ids
            lastFetchTime = System.currentTimeMillis()
            ids
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching audio catalogue", e)
            cached
        }
    }

    companion object {
        private const val TAG = "CategoryMediaTypes"

        // Matches the podcast-category cache in `LRTAutoRepository`: the catalogue gains a show
        // now and then, never within a drive.
        private const val CACHE_DURATION = 4 * 60 * 60 * 1000L // 4 hours

        // Comfortably above the ~500 audio categories that exist, so the truncation guard above
        // stays a guard rather than the normal path.
        private const val CATALOGUE_COUNT = 2000
    }
}
