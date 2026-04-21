import Foundation

extension Notification.Name {
  static let watchHistoryUpdated = Notification.Name("watchHistoryUpdated")
}

class CarPlayService {
  static let shared = CarPlayService()

  private let network = CarPlayNetwork.shared

  // In-memory only (per requirements — no disk persistence).
  private var continuePlayingCache: [CarPlayItem] = []
  private var articleInfoCache: [Int: PodcastEpisodeInfo] = [:]

  private init() {}

  var cachedContinuePlaying: [CarPlayItem] {
    return continuePlayingCache
  }

  func fetchRecommended() async throws -> [CarPlayItem] {
    return try await network.fetchRecommended()
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

  func isLoggedIn() -> Bool {
    return CarPlayAuthManager.shared.isLoggedIn()
  }

  // MARK: - Watch history (Continue playing)

  /// Fetches watch-history entries from backend, hydrates with article metadata,
  /// caches the result in memory, and posts a `watchHistoryUpdated` notification.
  @discardableResult
  func refreshContinuePlaying(count: Int = 20) async -> [CarPlayItem] {
    guard isLoggedIn() else {
      continuePlayingCache = []
      NotificationCenter.default.post(name: .watchHistoryUpdated, object: nil)
      return []
    }
    do {
      let token = try await CarPlayAuthManager.shared.getAccessToken()
      let entries = try await network.fetchWatchHistory(
        mediaType: "audio", count: count, accessToken: token
      )
      for e in entries {
        print("watch-history entry: articleId=\(e.articleId) pos=\(e.positionSec)/\(e.durationSec) pct=\(e.progressPct)")
      }
      let items = await hydrateEntries(entries)
      
      continuePlayingCache = items
      NotificationCenter.default.post(name: .watchHistoryUpdated, object: nil)
      return items
    } catch {
      print("refreshContinuePlaying failed: \(error.localizedDescription)")
      return continuePlayingCache
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
      for entry in entries where articleInfoCache[entry.articleId] == nil {
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
          articleInfoCache[articleId] = info
        }
      }
    }

    return entries.compactMap { entry in
      guard let info = articleInfoCache[entry.articleId],
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
