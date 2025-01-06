import Foundation

class CarPlayCache {
  static let shared = CarPlayCache()

  private var cache: [URL: (items: [CarPlayItem], timestamp: Date)] = [:]
  private let cacheExpiration: TimeInterval = 180  // 3 minutes
  private let cacheQueue = DispatchQueue(label: "com.lrt.carplay.cache", attributes: .concurrent)

  private init() {}

  func getCachedItems(for url: URL) -> [CarPlayItem]? {
    return cacheQueue.sync {
      guard let cached = cache[url],
        Date().timeIntervalSince(cached.timestamp) < cacheExpiration
      else {
        return nil
      }
      return cached.items
    }
  }

  func setCachedItems(_ items: [CarPlayItem], for url: URL) {
    cacheQueue.async(flags: .barrier) {
      self.cache[url] = (items: items, timestamp: Date())
    }
  }
}
