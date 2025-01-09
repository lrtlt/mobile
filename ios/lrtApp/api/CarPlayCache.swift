import Foundation

class CarPlayCache {
  static let shared = CarPlayCache()

  // Cache for fetched items
  private var cache: [URL: (items: [Any], timestamp: Date)] = [:]

  // Cache for playback state
  private var shouldResumePlayer: Bool = false

  //Cache for last selected tab title. Used to restore UI state after reconnection
  private var currentTemplateTitle: String?

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

  func setShouldResumePlayer(_ shouldResume: Bool) {
    cacheQueue.async(flags: .barrier) {
      self.shouldResumePlayer = shouldResume
    }
  }

  func getShouldResumePlayer() -> Bool {
    return cacheQueue.sync {
      return self.shouldResumePlayer
    }
  }

  func getCurrentTemplateTitle() -> String? {
    return cacheQueue.sync {
      return self.currentTemplateTitle
    }
  }

  func setCurrentTemplateTitle(_ title: String?) {
    cacheQueue.async(flags: .barrier) {
      self.currentTemplateTitle = title
    }
  }

}
