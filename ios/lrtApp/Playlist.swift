import Foundation

class Playlist {
  static let shared = Playlist()

  /// The queue and the position inside it are only ever set together, through `setQueue`.
  /// Assigning them independently is what used to let `currentIndex` address a different
  /// array than `currentPlaylist` (tap a "Klausykite toliau" row, then a "Siūlome" row).
  private(set) var currentPlaylist: [CarPlayItem] = []
  private(set) var currentIndex: Int = 0

  var current: CarPlayItem? {
    guard !currentPlaylist.isEmpty, currentIndex < currentPlaylist.count else { return nil }
    return currentPlaylist[currentIndex]
  }

  private init() {}

  /// Replaces the queue and positions it at `index`. The section the user tapped in becomes
  /// the queue, so utility rows (`Atnaujinti`, `Daugiau`) are never part of `items` and can
  /// never shift the index.
  func setQueue(_ items: [CarPlayItem], startingAt index: Int) {
    currentPlaylist = items
    currentIndex = items.isEmpty ? 0 : min(max(index, 0), items.count - 1)
  }

  /// Replaces the queue and positions it at `item`, matched on `articleId` first and on the
  /// stream URL only as a fallback.
  ///
  /// Both lookups are keyed off a value the tapped item actually has, so an item without an id
  /// can never collide with every other id-less item — which is what matching on `streamUrl`
  /// alone did, silently landing on index 0.
  func setQueue(_ items: [CarPlayItem], startingWith item: CarPlayItem) {
    let byArticleId = item.articleId.flatMap { id in
      items.firstIndex { $0.articleId == id }
    }
    let byStreamUrl = item.streamUrl.flatMap { url in
      items.firstIndex { $0.streamUrl == url }
    }
    setQueue(items, startingAt: byArticleId ?? byStreamUrl ?? 0)
  }

  /// The queued entry at `index`, or nil when the queue has since been replaced by a shorter
  /// one. Lets a caller holding an index from before an `await` check it still means what it
  /// meant when it was taken.
  func item(at index: Int) -> CarPlayItem? {
    guard currentPlaylist.indices.contains(index) else { return nil }
    return currentPlaylist[index]
  }

  /// Swaps a queued entry for a stream-resolved copy of itself, keeping the position.
  /// Podcast episode queues start out without stream URLs (see `PlayerController`).
  func replaceItem(at index: Int, with item: CarPlayItem) {
    guard currentPlaylist.indices.contains(index) else { return }
    currentPlaylist[index] = item
  }

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
