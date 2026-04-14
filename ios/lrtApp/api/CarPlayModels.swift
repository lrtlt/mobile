import Foundation

struct CarPlayItem: Decodable {
  let title: String
  let content: String
  let cover: String?
  let streamUrl: String?
  let isLive: Bool?
  let channelId: Int?
  let articleId: Int?
  let startPositionSec: Int?
  let progressPct: Double?

  enum CodingKeys: String, CodingKey {
    case title, content, cover, streamUrl, isLive, channelId, startPositionSec, progressPct
    case articleId = "id"
  }

  init(
    title: String, content: String, cover: String?, streamUrl: String?, isLive: Bool?,
    channelId: Int?, articleId: Int? = nil, startPositionSec: Int? = nil,
    progressPct: Double? = nil
  ) {
    self.title = title
    self.content = content
    self.cover = cover
    self.streamUrl = streamUrl
    self.isLive = isLive
    self.channelId = channelId
    self.articleId = articleId
    self.startPositionSec = startPositionSec
    self.progressPct = progressPct
  }
}

struct WatchHistoryEntry: Codable {
  let articleId: Int
  let mediaType: String
  let categoryId: Int?
  let positionSec: Int
  let durationSec: Int
  let progressPct: Double
  let completed: Bool
  let updatedAt: Int64

  enum CodingKeys: String, CodingKey {
    case articleId, mediaType, positionSec, durationSec, progressPct, completed, updatedAt
    case categoryId = "category_id"
  }
}

struct WatchHistoryResponse: Decodable {
  let list: [WatchHistoryEntry]
}

struct WatchHistoryPushRequest: Encodable {
  let list: [WatchHistoryEntry]
}

struct LiveProgramResponse: Decodable {
  let tvprog: LiveProgram
}

struct LiveProgram: Decodable {
  let items: [LiveProgramItem]
}

struct LiveProgramItem: Decodable {
  let channel_id: Int
  let channel_title: String
  let title: String
  let stream_url: String?
}

struct StreamInfoResponse: Decodable {
  let response: StreamInfoWrapper
}

struct StreamInfoWrapper: Decodable {
  let data: StreamInfo
}

struct StreamInfo: Decodable {
  let audio: String?
  let content: String?
  let restriction: String?
}

struct PodcastCategoriesResponse: Decodable {
  let total: Int?
  let items: [PodcastCategory]?

  enum CodingKeys: String, CodingKey {
    case total = "total_found"
    case items
  }
}

struct PodcastCategory: Decodable {
  let title: String?
  let id: Int?
}

struct PodcastEpisodesResponse: Decodable {
  let nextPage: Int?
  let page: Int?
  let items: [PodcastEpisode]?

  enum CodingKeys: String, CodingKey {
    case nextPage = "next_page"
    case page
    case items = "articles"
  }
}

struct PodcastEpisode: Decodable {
  let title: String?
  let id: Int?
  let imgPathPrefix: String?
  let imgPathPostfix: String?
  let durationSeconds: Int?

  enum CodingKeys: String, CodingKey {
    case title
    case id
    case imgPathPrefix = "img_path_prefix"
    case imgPathPostfix = "img_path_postfix"
    case durationSeconds = "media_duration_sec"
  }
}

struct PodcastEpisodeInfoResponse: Decodable {
  let info: PodcastEpisodeInfo?

  enum CodingKeys: String, CodingKey {
    case info = "article"
  }
}

struct PodcastEpisodeInfo: Decodable {
  let id: Int?
  let streamUrl: String?
  let title: String?
  let categoryTitle: String?
  let mainPhoto: MainPhoto?

  enum CodingKeys: String, CodingKey {
    case id
    case streamUrl = "stream_url"
    case title
    case categoryTitle = "category_title"
    case mainPhoto = "main_photo"
  }
}

struct MainPhoto: Decodable {
  let path: String?
}

struct SubscriptionsResponse: Decodable {
  let subscriptions: [UserSubscription]
}

struct UserSubscription: Decodable {
  let subscriptionKey: String
  let isActive: Bool
  let name: String?

  enum CodingKeys: String, CodingKey {
    case subscriptionKey = "subscription_key"
    case isActive = "is_active"
    case name
  }
}
