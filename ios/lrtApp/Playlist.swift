import Foundation

class Playlist {
  static let shared = Playlist()

  var currentPlaylist: [CarPlayItem] = []
  var currentIndex: Int = 0

  var current: CarPlayItem? {
    guard !currentPlaylist.isEmpty, currentIndex < currentPlaylist.count else { return nil }
    return currentPlaylist[currentIndex]
  }

  private init() {}

  func next() -> CarPlayItem? {
    guard !currentPlaylist.isEmpty else { return nil }
    currentIndex = (currentIndex + 1) % currentPlaylist.count
    return currentPlaylist[currentIndex]
  }

  func previous() -> CarPlayItem? {
    guard !currentPlaylist.isEmpty else { return nil }
    currentIndex = (currentIndex - 1 + currentPlaylist.count) % currentPlaylist.count
    return currentPlaylist[currentIndex]
  }
}
