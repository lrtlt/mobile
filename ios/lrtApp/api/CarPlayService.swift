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
}
