import Foundation

/// Whether a show category publishes audio episodes (radioteka) or video ones (mediateka).
enum CategoryMediaType {
  case audio
  case video
}

/// Resolves a category id to its `CategoryMediaType`.
///
/// A subscription arrives as a bare `category-<id>` key with `is_active` and a display name and
/// nothing else — see `UserSubscription` — so a podcast subscription is indistinguishable from a
/// TV-show one until the id is resolved against the catalogue.
/// `api/json/search/categories?type=audio` is that catalogue: its ids are exactly the radioteka
/// set, it shares no id with the `type=video` set, and the two together cover every category, so
/// membership settles the type outright.
///
/// Deliberately kept out of `CarPlayService`, which is a plain data source. CarPlay needs only one
/// half of this today — `keepAudio` drops video subscriptions from `Prenumeratos`, because a TV
/// show has nothing to play in a car — but the classification itself is the reusable part and the
/// video half is expected back (labelling mixed lists, or a video section once the car UI has
/// somewhere to put one). That belongs here rather than inline at a call site.
actor CategoryMediaTypeResolver {
  static let shared = CategoryMediaTypeResolver()

  /// Matches the podcast-category cache elsewhere: the catalogue gains a show now and then, never
  /// within a drive.
  private static let cacheDuration: TimeInterval = 4 * 60 * 60

  private var audioCategoryIds: Set<Int>?
  private var lastFetchDate: Date?

  private let network = CarPlayNetwork.shared

  private init() {}

  /// The type of `categoryId`, or nil when the catalogue could not be resolved — a failed fetch
  /// with nothing cached, or a truncated response.
  ///
  /// Nil means *not known*, never video. Callers must not fold it into the video case: hiding a
  /// podcast the driver actually subscribed to is a worse failure than briefly showing a show that
  /// turns out to be video.
  func mediaType(of categoryId: Int) async -> CategoryMediaType? {
    guard let ids = await resolveAudioCategoryIds() else { return nil }
    return ids.contains(categoryId) ? .audio : .video
  }

  /// `subscriptions` with the video ones removed.
  ///
  /// Fails open: an unresolvable catalogue returns the list untouched, on the same reasoning as
  /// `mediaType(of:)`. Keys that are not category subscriptions (`UserSubscription.categoryId`
  /// nil) pass through — this filter only ever removes video, and the grid skips those on its own.
  func keepAudio(_ subscriptions: [UserSubscription]) async -> [UserSubscription] {
    guard !subscriptions.isEmpty else { return subscriptions }
    guard let ids = await resolveAudioCategoryIds() else { return subscriptions }
    return subscriptions.filter { subscription in
      guard let categoryId = subscription.categoryId else { return true }
      return ids.contains(categoryId)
    }
  }

  /// The audio half of the catalogue, cached for `cacheDuration`. Nil when it has never been
  /// resolved; a failed refresh keeps serving the previous set rather than dropping to nil.
  private func resolveAudioCategoryIds() async -> Set<Int>? {
    let cached = audioCategoryIds
    if let cached = cached, let fetched = lastFetchDate,
      Date().timeIntervalSince(fetched) <= Self.cacheDuration
    {
      return cached
    }

    do {
      // Same endpoint the `Laidos` tab lists podcasts from, asked for wholesale.
      let response = try await network.fetchAudioCategoryCatalogue()
      let items = response.items ?? []
      // `count` truncates silently — `total_found` reports the real size while `items` holds only
      // the first `count`. A short list would classify every missing podcast as video, so it is
      // rejected outright rather than half-applied.
      if let total = response.total, items.count < total {
        print("Audio catalogue truncated: \(items.count) of \(total), not classifying")
        return cached
      }
      let ids = Set(items.compactMap { $0.id })
      guard !ids.isEmpty else { return cached }
      audioCategoryIds = ids
      lastFetchDate = Date()
      return ids
    } catch {
      print("Failed to fetch audio catalogue: \(error.localizedDescription)")
      return cached
    }
  }
}
