import Foundation

class CarPlayService {
  static let shared = CarPlayService()

  private let network = CarPlayNetwork.shared

  private init() {}

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
}
