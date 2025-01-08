import Foundation

struct PlaybackState {
  let item: CarPlayItem
  let position: TimeInterval
  let tab: String?
}

class CarPlayCache {
  static let shared = CarPlayCache()

  private var cache: [URL: (items: [Any], timestamp: Date)] = [:]
  private var playbackState: PlaybackState?
  private let cacheExpiration: TimeInterval = 180  // 3 minutes
  private let cacheQueue = DispatchQueue(label: "com.lrt.carplay.cache", attributes: .concurrent)

  private init() {}

  func getCachedItems(for url: URL) -> [Any]? {
    return cacheQueue.sync {
      guard let cached = cache[url],
        Date().timeIntervalSince(cached.timestamp) < cacheExpiration
      else {
        return nil
      }
      return cached.items
    }
  }

  func setCachedItems(_ items: [Any], for url: URL) {
    cacheQueue.async(flags: .barrier) {
      self.cache[url] = (items: items, timestamp: Date())
    }
  }

  func savePlaybackState(item: CarPlayItem, position: TimeInterval, tab: String?) {
    cacheQueue.async(flags: .barrier) {
      self.playbackState = PlaybackState(
        item: item,
        position: position,
        tab: tab
      )
    }
  }

  func getPlaybackState() -> PlaybackState? {
    return cacheQueue.sync {
      return self.playbackState
    }
  }

  func clearPlaybackState() {
    cacheQueue.async(flags: .barrier) {
      self.playbackState = nil
    }
  }
}
