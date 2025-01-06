import Foundation

class CarPlayNetwork {
  static let shared = CarPlayNetwork()

  private let recommendedUrl = URL(string: "https://www.lrt.lt/static/carplay/rekomenduoja.json")!
  private let newestUrl = URL(string: "https://www.lrt.lt/static/carplay/naujausi.json")!
  private let liveUrl = URL(string: "https://www.lrt.lt/static/tvprog/tvprog.json")!

  private init() {}

  func fetchRecommended() async throws -> [CarPlayItem] {
    return try await fetchItems(from: recommendedUrl)
  }

  func fetchNewest() async throws -> [CarPlayItem] {
    return try await fetchItems(from: newestUrl)
  }

  func fetchLive() async throws -> [CarPlayItem] {
    // Check cache first
    if let cached = CarPlayCache.shared.getCachedItems(for: liveUrl) {
      return cached
    }

    // Fetch fresh data
    let (data, _) = try await URLSession.shared.data(from: liveUrl)
    let response = try JSONDecoder().decode(LiveProgramResponse.self, from: data)
    let program = response.tvprog

    // Map program items to CarPlayItems with stream info
    var items: [CarPlayItem] = []
    for item in program.items {
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

  private func fetchStreamInfo(streamUrl: String) async throws -> StreamInfo {
    let url = URL(string: streamUrl)!
    let (data, _) = try await URLSession.shared.data(from: url)
    let response = try JSONDecoder().decode(StreamInfoResponse.self, from: data)
    return response.response.data
  }

  private func fetchItems(from url: URL) async throws -> [CarPlayItem] {
    // Check cache first
    if let cached = CarPlayCache.shared.getCachedItems(for: url) {
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
