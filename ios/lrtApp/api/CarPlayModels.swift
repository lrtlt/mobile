import Foundation

struct CarPlayItem: Decodable {
  let title: String
  let content: String
  let cover: String?
  let streamUrl: String?
  let isLive: Bool?
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

  enum CodingKeys: String, CodingKey {
    case id
    case streamUrl = "stream_url"
  }
}
