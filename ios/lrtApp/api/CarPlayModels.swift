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
