import Foundation

extension Notification.Name {
  static let watchHistoryUpdated = Notification.Name("watchHistoryUpdated")
  static let nowPlayingItemChanged = Notification.Name("nowPlayingItemChanged")
}

class CarPlayService {
  static let shared = CarPlayService()

  /// Continue-playing entries older than this many days are filtered out.
  private static let continuePlayingMaxAgeDays = 15

  private let network = CarPlayNetwork.shared

  // In-memory only (per requirements — no disk persistence).
  // `refreshContinuePlaying` writes these from a background executor while the CarPlay scene
  // reads them on the main actor — and now from two tabs — so every access goes through
  // `stateQueue`.
  private var continuePlayingCache: [CarPlayItem] = []
  private var articleInfoCache: [Int: PodcastEpisodeInfo] = [:]
  /// Subscription cover URLs by `subscriptionKey`. Each miss costs a category fetch, so this is
  /// what keeps `Prenumeratos` from re-requesting every episode list on each tab visit.
  private var subscriptionCoverCache: [String: String] = [:]
  private let stateQueue = DispatchQueue(
    label: "com.lrt.carplay.service.state", attributes: .concurrent)

  private init() {}

  var cachedContinuePlaying: [CarPlayItem] {
    return stateQueue.sync { continuePlayingCache }
  }

  private func setCachedContinuePlaying(_ items: [CarPlayItem]) {
    stateQueue.sync(flags: .barrier) { self.continuePlayingCache = items }
  }

  /// Drops one article from the cached continue-playing list.
  ///
  /// Needed because this cache is otherwise written only by `refreshContinuePlaying`, which runs
  /// on a tab load — so finishing an episode would push `completed` to the backend and leave the
  /// row on screen until the driver navigated somewhere. Worse, `CarSceneDelegate` skips a
  /// repaint when the cached data's signature is unchanged, so the `watchHistoryUpdated` that
  /// follows the push would do nothing at all.
  ///
  /// The phone app needs no equivalent: its store is local, so `upsertProgress` writing and
  /// `getEntries` re-deriving happen in the same tick. This is the CarPlay stand-in for that.
  func removeFromContinuePlaying(articleId: Int) {
    stateQueue.sync(flags: .barrier) {
      self.continuePlayingCache.removeAll { $0.articleId == articleId }
    }
  }

  /// Updates progress on a cached continue-playing row without rebuilding the list identity.
  /// Home uses this to move the progress bar in place instead of calling `updateSections`.
  func updateContinuePlayingProgress(articleId: Int, progressPct: Double, positionSec: Int) {
    stateQueue.sync(flags: .barrier) {
      guard let index = self.continuePlayingCache.firstIndex(where: { $0.articleId == articleId })
      else { return }
      self.continuePlayingCache[index] = self.continuePlayingCache[index].withProgress(
        progressPct: progressPct, startPositionSec: positionSec)
    }
  }

  private func cachedArticleInfo(for articleId: Int) -> PodcastEpisodeInfo? {
    return stateQueue.sync { articleInfoCache[articleId] }
  }

  private func setCachedArticleInfo(_ info: PodcastEpisodeInfo, for articleId: Int) {
    stateQueue.sync(flags: .barrier) { self.articleInfoCache[articleId] = info }
  }

  private func cachedSubscriptionCover(for key: String) -> String? {
    return stateQueue.sync { subscriptionCoverCache[key] }
  }

  private func setCachedSubscriptionCover(_ cover: String, for key: String) {
    stateQueue.sync(flags: .barrier) { self.subscriptionCoverCache[key] = cover }
  }

  func fetchRecommended(ignoreCache: Bool = false) async throws -> [CarPlayItem] {
    return try await network.fetchRecommended(ignoreCache: ignoreCache)
  }

  func fetchNewest() async throws -> [CarPlayItem] {
    return try await network.fetchNewest()
  }

  func fetchLive() async throws -> [CarPlayItem] {
    return try await network.fetchLive()
  }

  func fetchPodcasts() async throws -> [PodcastCategory] {
    return try await network.fetchPodcasts()
  }

  func fetchEpisodes(categoryId: Int) async throws -> [PodcastEpisode] {
    return try await network.fetchPodcastEpisodes(categoryId: categoryId)
  }

  func fetchEpisodeInfo(episodeId: Int) async throws -> PodcastEpisodeInfoResponse {
    return try await network.fetchEpisodeInfo(episodeId: episodeId)
  }

  func fetchSubscriptions() async throws -> [UserSubscription] {
    let token = try await CarPlayAuthManager.shared.getAccessToken()
    return try await network.fetchSubscriptions(accessToken: token)
  }

  /// Cover art for each subscription, keyed by `subscriptionKey`.
  ///
  /// Neither `UserSubscription` nor `PodcastCategory` carries artwork — only `PodcastEpisode`
  /// does — so a category's cover has to be borrowed from its newest episode. That is one
  /// request per subscription, run concurrently and cached for the session, which is the price
  /// of rendering `Prenumeratos` as a grid rather than as text rows.
  ///
  /// A subscription whose fetch fails is simply absent from the result; the grid drops tiles it
  /// has no image for.
  func fetchSubscriptionCovers(for subscriptions: [UserSubscription]) async -> [String: String] {
    let wanted = subscriptions.filter { $0.categoryId != nil }
    let missing = wanted.filter { cachedSubscriptionCover(for: $0.subscriptionKey) == nil }

    if !missing.isEmpty {
      await withTaskGroup(of: (String, String?).self) { group in
        for subscription in missing {
          group.addTask { [weak self] in
            guard let self = self, let categoryId = subscription.categoryId else {
              return (subscription.subscriptionKey, nil)
            }
            do {
              let episodes = try await self.network.fetchPodcastEpisodes(categoryId: categoryId)
              let cover = episodes.lazy.compactMap { episode -> String? in
                guard let prefix = episode.imgPathPrefix, let postfix = episode.imgPathPostfix
                else { return nil }
                return "https://lrt.lt\(prefix)282x158\(postfix)"
              }.first
              return (subscription.subscriptionKey, cover)
            } catch {
              return (subscription.subscriptionKey, nil)
            }
          }
        }
        for await (key, cover) in group {
          if let cover = cover {
            setCachedSubscriptionCover(cover, for: key)
          }
        }
      }
    }

    var covers = [String: String]()
    for subscription in wanted {
      if let cover = cachedSubscriptionCover(for: subscription.subscriptionKey) {
        covers[subscription.subscriptionKey] = cover
      }
    }
    return covers
  }

  func isLoggedIn() -> Bool {
    return CarPlayAuthManager.shared.isLoggedIn()
  }

  // MARK: - Watch history (Continue playing)

  /// Fetches watch-history entries from backend, hydrates with article metadata,
  /// caches the result in memory, and posts a `watchHistoryUpdated` notification.
  @discardableResult
  func refreshContinuePlaying(count: Int = 20) async -> [CarPlayItem] {
    guard isLoggedIn() else {
      // Blanks the `Klausykite toliau` section in both tabs that render it.
      setCachedContinuePlaying([])
      NotificationCenter.default.post(name: .watchHistoryUpdated, object: nil)
      return []
    }
    do {
      let token = try await CarPlayAuthManager.shared.getAccessToken()
      let allEntries = try await network.fetchWatchHistory(
        mediaType: "audio", count: count, accessToken: token
      )
      let maxAgeMs = Int64(Self.continuePlayingMaxAgeDays) * 24 * 60 * 60 * 1000
      let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
      // `completed` is filtered here, not by the backend, which returns finished entries like
      // any other. The phone app does the same thing in `playback_progress_store.getEntries`,
      // which is the single source of truth for this screen's semantics — an entry that has
      // been played to the end is history, not something to continue.
      //
      // Sorted newest-first to match both the phone app and Android Auto; the endpoint's own
      // order is not relied on.
      let entries = allEntries
        .filter { !$0.completed && nowMs - $0.updatedAt <= maxAgeMs }
        .sorted { $0.updatedAt > $1.updatedAt }
      let items = await hydrateEntries(entries)

      setCachedContinuePlaying(items)
      NotificationCenter.default.post(name: .watchHistoryUpdated, object: nil)
      return items
    } catch {
      print("refreshContinuePlaying failed: \(error.localizedDescription)")
      return cachedContinuePlaying
    }
  }

  /// Pushes a single playback progress entry to the backend.
  func pushPlaybackProgress(entry: WatchHistoryEntry) async {
    guard isLoggedIn() else {
      print("pushPlaybackProgress: not logged in")
      return
    }
    do {
      let token = try await CarPlayAuthManager.shared.getAccessToken()
      print("pushPlaybackProgress: POST articleId=\(entry.articleId) pos=\(entry.positionSec)/\(entry.durationSec) pct=\(entry.progressPct) completed=\(entry.completed)")
      try await network.pushWatchHistory(entries: [entry], accessToken: token)
      print("pushPlaybackProgress: OK")
    } catch {
      print("pushPlaybackProgress failed: \(error.localizedDescription)")
    }
  }

  func deletePlaybackProgress(articleId: Int) async {
    guard isLoggedIn() else { return }
    do {
      let token = try await CarPlayAuthManager.shared.getAccessToken()
      try await network.deleteWatchHistory(articleId: articleId, accessToken: token)
    } catch {
      print("deletePlaybackProgress failed: \(error.localizedDescription)")
    }
  }

  private func hydrateEntries(_ entries: [WatchHistoryEntry]) async -> [CarPlayItem] {
    // Fetch article metadata for any entries we haven't seen yet, then build CarPlayItems.
    await withTaskGroup(of: (Int, PodcastEpisodeInfo?).self) { group in
      for entry in entries where cachedArticleInfo(for: entry.articleId) == nil {
        group.addTask { [weak self] in
          guard let self = self else { return (entry.articleId, nil) }
          do {
            let info = try await self.network.fetchEpisodeInfo(episodeId: entry.articleId)
            return (entry.articleId, info.info)
          } catch {
            return (entry.articleId, nil)
          }
        }
      }
      for await (articleId, info) in group {
        if let info = info {
          setCachedArticleInfo(info, for: articleId)
        }
      }
    }

    return entries.compactMap { entry in
      guard let info = cachedArticleInfo(for: entry.articleId),
        let streamUrl = info.streamUrl, !streamUrl.isEmpty
      else { return nil }
      let coverUrl = info.mainPhoto?.path.map {
        "https://www.lrt.lt\($0.replacingOccurrences(of: "{WxH}", with: "393x221"))"
      }
      return CarPlayItem(
        title: info.title ?? "",
        content: info.categoryTitle ?? "",
        cover: coverUrl,
        streamUrl: streamUrl,
        isLive: false,
        channelId: nil,
        articleId: entry.articleId,
        startPositionSec: entry.positionSec,
        progressPct: entry.progressPct
      )
    }
  }
}
