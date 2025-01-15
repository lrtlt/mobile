import Foundation

class CarPlayNetwork {
  static let shared = CarPlayNetwork()

  private let recommendedUrl = URL(string: "https://www.lrt.lt/static/carplay/rekomenduoja.json")!
  private let newestUrl = URL(string: "https://www.lrt.lt/static/carplay/naujausi.json")!
  private let liveUrl = URL(string: "https://www.lrt.lt/static/tvprog/tvprog.json")!
  private let podcastsUrl = URL(string: "https://www.lrt.lt/api/json/search/categories?type=audio")!

  private init() {}

  func fetchRecommended() async throws -> [CarPlayItem] {
    return try await fetchItems(from: recommendedUrl)
  }

  func fetchNewest() async throws -> [CarPlayItem] {
    return try await fetchItems(from: newestUrl)
  }

  func fetchLive() async throws -> [CarPlayItem] {
    // Check cache first
    if let cached = CarPlayCache.shared.getCachedItems(for: liveUrl) as? [CarPlayItem] {
      return cached
    }

    // Fetch fresh data
    let (data, _) = try await URLSession.shared.data(from: liveUrl)
    let response = try JSONDecoder().decode(LiveProgramResponse.self, from: data)
    let program = response.tvprog
    
    let channelIdOrder = [4, 5, 6, 1, 2, 3]
    let sortedProgramItems = program.items.sorted { (item1: LiveProgramItem, item2: LiveProgramItem) -> Bool in
      let index1 = channelIdOrder.firstIndex(of: item1.channel_id) ?? Int.max
      let index2 = channelIdOrder.firstIndex(of: item2.channel_id) ?? Int.max
      if index1 != index2 {
        return index1 < index2
      }
      // For items not in the ordered list, maintain their relative order
      return false
    }

    // Map program items to CarPlayItems with stream info
    var items: [CarPlayItem] = []
    
    for item in sortedProgramItems {
      if let streamUrl = item.stream_url {
        let streamInfo = try await fetchStreamInfo(streamUrl: streamUrl)
        let audioUrl = streamInfo.audio ?? streamInfo.content ?? ""

        items.append(
          CarPlayItem(
            title: streamInfo.restriction?.isEmpty == true
              ? item.channel_title : "Transliacija internetu negalima",
            content: item.title,
            cover: CarPlayUtils.getCoverByChannelId(channelId: item.channel_id),
            streamUrl: audioUrl.trimmingCharacters(in: .whitespacesAndNewlines),
            isLive: true
          ))
      }
    }

    // Update cache
    CarPlayCache.shared.setCachedItems(items, for: liveUrl)
    return items
  }

  func fetchPodcasts() async throws -> [PodcastCategory] {
    // Check cache first
    if let cached = CarPlayCache.shared.getCachedItems(for: podcastsUrl) as? [PodcastCategory] {
      return cached
    }

    // Fetch fresh data
    let (data, _) = try await URLSession.shared.data(from: podcastsUrl)
    let response = try JSONDecoder().decode(PodcastCategoriesResponse.self, from: data)
    let items = response.items ?? []

    // Update cache
    CarPlayCache.shared.setCachedItems(items, for: podcastsUrl)
    return items
  }

  func fetchPodcastEpisodes(categoryId: Int) async throws -> [PodcastEpisode] {
    let episodesUrl = URL(string: "https://www.lrt.lt/api/json/category?id=\(categoryId)")!

    print("Fetching episodes \(episodesUrl)")

    // Check cache first
    if let cached = CarPlayCache.shared.getCachedItems(for: episodesUrl) as? [PodcastEpisode] {
      return cached
    }

    // Fetch fresh data
    let (data, _) = try await URLSession.shared.data(from: episodesUrl)
    let response = try JSONDecoder().decode(PodcastEpisodesResponse.self, from: data)
    let episodes = response.items ?? []

    // Update cache
    CarPlayCache.shared.setCachedItems(episodes, for: episodesUrl)
    return episodes
  }

  func fetchEpisodeInfo(episodeId: Int) async throws -> PodcastEpisodeInfoResponse {
    let episodeUrl = URL(string: "https://www.lrt.lt/api/json/article/\(episodeId)")!
    print("Fetching episode info \(episodeUrl)")
    let (data, _) = try await URLSession.shared.data(from: episodeUrl)
    let episodeInfo = try JSONDecoder().decode(PodcastEpisodeInfoResponse.self, from: data)
    return episodeInfo
  }

  private func fetchStreamInfo(streamUrl: String) async throws -> StreamInfo {
    let url = URL(string: streamUrl)!
    let (data, _) = try await URLSession.shared.data(from: url)
    let response = try JSONDecoder().decode(StreamInfoResponse.self, from: data)
    return response.response.data
  }

  private func fetchItems(from url: URL) async throws -> [CarPlayItem] {
    // Check cache first
    if let cached = CarPlayCache.shared.getCachedItems(for: url) as? [CarPlayItem] {
      return cached
    }

    // Fetch fresh data
    let (data, _) = try await URLSession.shared.data(from: url)
    var items = try JSONDecoder().decode([CarPlayItem].self, from: data)
    // Filter out items without a stream URL
    items = items.filter { $0.streamUrl != nil }

    // Update cache
    CarPlayCache.shared.setCachedItems(items, for: url)

    return items
  }
}
