import AVFoundation
import CarPlay
import Foundation
import MediaPlayer

/// The CarPlay tab bar, in display order.
///
/// The raw value is the tab's display title, which is also the value `CarPlayCache` persists
/// for the tab restore. Keeping the title as the identity is deliberate — moving to stable ids
/// would re-key the restore.
enum CarPlayTab: String, CaseIterable {
  case home = "Siūlome"
  case live = "Tiesiogiai"
  case podcasts = "Laidos"
  case manoLRT = "Mano LRT"

  var symbolName: String {
    switch self {
    case .home: return "star.fill"
    case .live: return "play.square.fill"
    case .podcasts: return "circle.grid.3x3.fill"
    case .manoLRT: return "person.crop.circle"
    }
  }

  /// The suffix of the `carplay_tab_open_*` analytics event.
  ///
  /// Not the display title: Firebase event names admit only ASCII alphanumerics and underscores,
  /// and the titles clear neither bar — `Mano LRT` has a space, `Siūlome` has a `ū`. Either one
  /// makes the whole event invalid, and it is dropped rather than renamed.
  ///
  /// Spelled out per case instead of derived from the title, so the mapping is fixed at the
  /// source: a future rename changes the display string without silently re-keying a series in
  /// Firebase, and the compiler asks for a key when a tab is added. `ManoLRT` is kept as it was
  /// so that series stays continuous across the `Mano LRT` rename.
  var analyticsKey: String {
    switch self {
    case .home: return "Siulome"
    case .live: return "Tiesiogiai"
    case .podcasts: return "Laidos"
    case .manoLRT: return "ManoLRT"
    }
  }

  /// Resolves a persisted tab title, mapping titles that stopped existing onto their
  /// replacements. Anything else unrecognised resolves to nil, and the caller falls back to the
  /// first tab.
  ///
  /// `Laidos` needs no mapping: it is a tab again, and it still holds the A–Z podcast browse
  /// it held before, so a returning user lands where they left off.
  static func migrating(title: String) -> CarPlayTab? {
    switch title {
    case "Naujausi": return .home
    // `Mano LRT` gained its space. Only reachable if `CarPlayCache` ever persists to disk — it
    // is in-memory today — but the mapping costs a line and the alternative is a silent
    // fallback to the first tab.
    case "ManoLRT": return .manoLRT
    default: return CarPlayTab(rawValue: title)
    }
  }
}

/// The tile shape a `CPListImageRowItem` draws.
///
/// Honoured on iOS 26+ only. Below that the framework offers one image-row construction and
/// every style collapses onto it, so this is a preference the OS may decline — see
/// `CarPlayUIManager.makeImageRowItem`.
enum GridTileStyle {
  /// The cover and nothing else — no title, no subtitle. The only style whose tiles carry no
  /// text at all, and the one style the pre-26 path can also honour.
  case grid
  /// Cover with its title beneath it. No room for a subtitle.
  case imageGrid
  /// Image on the left, title and subtitle stacked to its right. Wider tiles, fewer per line.
  case condensed

  /// Whether the tiles carry a title. The pre-26 image row has two constructions — with titles
  /// and without — so this much of the style survives below iOS 26 even though the tile shape
  /// does not.
  var showsTitles: Bool {
    return self != .grid
  }
}

/// One tile's content, separated from what selecting it does — a tile can play something
/// (`Naujausi`, `Siūlome`) or navigate somewhere (`Prenumeratos`).
struct GridTile {
  /// Ignored by `.grid`, which draws the cover alone.
  let title: String
  /// Ignored by `.imageGrid` and `.grid`, neither of which has a slot for a subtitle.
  let subtitle: String?
  let image: UIImage
}

@MainActor
class CarPlayUIManager {
  private weak var interfaceController: CPInterfaceController?

  private var nowPlayingTemplate: CPNowPlayingTemplate?
  private var backwardButtonHandler: (() -> Void)?
  private var forwardButtonHandler: (() -> Void)?
  private var playbackRateHandler: (() -> Float)?

  /// Cover images, keyed by URL, for the lifetime of the CarPlay session. `Klausykite toliau`
  /// now lives in two tabs and repaints off a notification that fires every 10s during
  /// playback, so without this the same covers would be re-downloaded continuously.
  private var coverImageCache: [String: UIImage] = [:]

  init(interfaceController: CPInterfaceController) {
    self.interfaceController = interfaceController
  }

  func setupInitialUI(delegate: CPTabBarTemplateDelegate, initialTab: CarPlayTab?) {
    let templates = CarPlayTab.allCases.map {
      createListTemplate(title: $0.rawValue, imageName: $0.symbolName)
    }

    let tabBarTemplate = CPTabBarTemplate(templates: templates)

    tabBarTemplate.delegate = delegate

    interfaceController?.setRootTemplate(tabBarTemplate, animated: true) { success, error in
      let seconds = 1.0
      DispatchQueue.main.asyncAfter(deadline: .now() + seconds) {
        if let initialTab = initialTab {
          if #available(iOS 17.0, *) {
            // Still matched by title (docs/carplay-ui.md §7). An unknown title can no longer
            // reach here, but a miss falls back to the first tab rather than silently
            // doing nothing.
            let templateIndex =
              tabBarTemplate.templates.firstIndex(where: {
                ($0 as? CPListTemplate)?.title == initialTab.rawValue
              }) ?? 0
            tabBarTemplate.selectTemplate(at: templateIndex)
          }
        }
      }
    }
  }

  private func createListTemplate(title: String, imageName: String)
    -> CPListTemplate
  {
    let image = UIImage(systemName: imageName)
    let listTemplate = CPListTemplate(title: title, sections: [])
    listTemplate.tabImage = image
    return listTemplate
  }

  // Note: there was a `contentRowBudget(reserving:)` here, which capped an open-ended section
  // against `CPListTemplate.maximumItemCount` so the system's silent trim — which works from
  // the end, where every navigation affordance sits — could not eat it. `Prenumeratos` was its
  // last caller; as a grid it is one row, so no section in the app is open-ended any more and
  // nothing needs the budget. Bring it back if one ever is again (docs/carplay-ui.md §10).

  /// Downloads any cover images for `items` that aren't cached yet and returns the ones it has,
  /// keyed by cover URL.
  ///
  /// Split out from `createListItems` so a single download pass can serve rows built for more
  /// than one template — `CPListItem` instances belong to one section at a time and can't be
  /// shared between the Home and Mano LRT copies of `Klausykite toliau`, but their images can.
  func loadCovers(for items: [CarPlayItem]) async -> [String: UIImage] {
    return await loadCovers(urls: items.compactMap { $0.cover })
  }

  /// The URL-keyed half of `loadCovers(for:)`, for callers whose covers do not come off a
  /// `CarPlayItem` — `Prenumeratos` borrows its artwork from each category's newest episode.
  func loadCovers(urls: [String]) async -> [String: UIImage] {
    let missing = Set(urls).filter { coverImageCache[$0] == nil }

    if !missing.isEmpty {
      await withTaskGroup(of: (String, UIImage?).self) { group in
        for url in missing {
          group.addTask {
            let image = await CarPlayUIManager.loadImage(from: url)
            return (url, image)
          }
        }

        for await (url, image) in group {
          if let image = image {
            coverImageCache[url] = image
          }
        }
      }
    }

    var covers = [String: UIImage]()
    for url in urls {
      if let image = coverImageCache[url] {
        covers[url] = image
      }
    }
    return covers
  }

  /// Builds playable rows from already-loaded cover images.
  func makeListItems(
    from items: [CarPlayItem], covers: [String: UIImage], handler: @escaping (CarPlayItem) -> Void
  ) -> [CPListItem] {
    return items.map { item in
      let listItem = CPListItem(text: item.title, detailText: item.content)
      listItem.accessoryType = .disclosureIndicator
      if let coverUrl = item.cover, let image = covers[coverUrl] {
        listItem.setImage(image)
      }
      listItem.handler = { _, completion in
        Task {
          handler(item)
          completion()
        }
      }
      return listItem
    }
  }

  func createListItems(from items: [CarPlayItem], handler: @escaping (CarPlayItem) -> Void) async
    -> [CPListItem]
  {
    let covers = await loadCovers(for: items)
    return makeListItems(from: items, covers: covers, handler: handler)
  }

  /// Builds `items` as a single grid row rather than one list row each.
  ///
  /// CarPlay has no grid *section*. `CPGridTemplate` is a whole template, and Home needs three
  /// sections, so it is not an option here. `CPListImageRowItem` is the one construct that puts
  /// a grid inside a list: it counts as a single row and lays its images out across the row.
  ///
  /// An item with no downloaded cover cannot appear — the grid is images, and a gap would shift
  /// every index after it — so the handler is passed the items actually rendered alongside the
  /// selected one. That list, not the full input, is what the tap should queue.
  ///
  /// `shown` is returned as well as handed to the handler, so a caller can tell whether the grid
  /// swallowed its whole input and decide whether a drill-in row is worth showing.
  ///
  /// `limit` caps the tiles drawn. It applies *after* the cover filter, so a section asking for
  /// 6 gets 6 whenever 6 of its items have covers, rather than losing a tile per failed
  /// download. How many of those fit on a line is the car's and the style's business — a
  /// `.condensed` tile is much wider than a `.grid` one — so a limit bounds the section rather
  /// than describing its shape.
  func makeImageRowItem(
    from items: [CarPlayItem], covers: [String: UIImage], style: GridTileStyle,
    limit: Int? = nil,
    handler: @escaping (CarPlayItem, [CarPlayItem]) -> Void
  ) -> (row: CPListImageRowItem, shown: [CarPlayItem]) {
    let paired: [(item: CarPlayItem, image: UIImage)] = items.compactMap { item in
      guard let url = item.cover, let image = covers[url] else { return nil }
      return (item, image)
    }

    let visible = Array(paired.prefix(Self.drawableTileCount(of: paired.count, limit: limit)))
    let shown = visible.map(\.item)
    let tiles = visible.map {
      GridTile(title: $0.item.title, subtitle: $0.item.content, image: $0.image)
    }

    let row = makeImageRow(tiles: tiles, style: style) { index in
      guard shown.indices.contains(index) else { return }
      handler(shown[index], shown)
    }
    return (row, shown)
  }

  /// Builds `subscriptions` as a grid.
  ///
  /// Subscriptions carry no artwork of their own, so `covers` is keyed by `subscriptionKey`
  /// rather than by image URL — see `CarPlayService.fetchSubscriptionCovers`. A subscription
  /// with no cover cannot be a tile, exactly as elsewhere, which is why `shown` comes back:
  /// the caller needs to know what the driver can actually reach from here.
  ///
  /// Selecting a tile navigates rather than plays, which is why this cannot go through
  /// `makeImageRowItem`.
  func makeSubscriptionRow(
    from subscriptions: [UserSubscription], covers: [String: UIImage],
    style: GridTileStyle, limit: Int? = nil,
    handler: @escaping (UserSubscription) -> Void
  ) -> (row: CPListImageRowItem, shown: [UserSubscription]) {
    let paired: [(subscription: UserSubscription, image: UIImage)] = subscriptions.compactMap {
      subscription in
      guard let image = covers[subscription.subscriptionKey] else { return nil }
      return (subscription, image)
    }

    let visible = Array(paired.prefix(Self.drawableTileCount(of: paired.count, limit: limit)))
    let shown = visible.map(\.subscription)
    let tiles = visible.map {
      // Both texts are carried but neither is drawn under the `.grid` style this section uses.
      // They are kept so the section can be restyled without rebuilding the tiles, and because
      // the pre-17.4 legacy row would ignore them anyway.
      GridTile(title: $0.subscription.name ?? "", subtitle: nil, image: $0.image)
    }

    let row = makeImageRow(tiles: tiles, style: style) { index in
      guard shown.indices.contains(index) else { return }
      handler(shown[index])
    }
    return (row, shown)
  }

  /// How many tiles a grid will actually draw, given how many it could draw and the caller's
  /// limit. Below iOS 26 the framework imposes its own ceiling on top; the lower one wins.
  private static func drawableTileCount(of available: Int, limit: Int?) -> Int {
    var cap = limit ?? Int.max
    if #unavailable(iOS 26.0) {
      cap = min(cap, Int(CPMaximumNumberOfGridImages))
    }
    return min(available, cap)
  }

  /// Draws exactly the tiles it is given — trimming already happened in `drawableTileCount`.
  /// `onSelect` receives an index into `tiles`.
  private func makeImageRow(
    tiles: [GridTile], style: GridTileStyle, onSelect: @escaping (Int) -> Void
  ) -> CPListImageRowItem {
    let rowItem: CPListImageRowItem

    if #available(iOS 26.0, *) {
      // Every style that can carry an `imageShape` uses `.roundedRectangle` rather than
      // `.circular`: covers are photographic 16:9 article images, and a circular mask would crop
      // most of one away. `.grid`'s element takes no shape at all. All leave
      // `accessorySymbolName` nil — even the subscription grid, whose tiles do navigate, since
      // a chevron on a tile reads as decoration at a glance. Multiple lines let every tile show
      // rather than only the first lineful.
      switch style {
      case .grid:
        // The cover alone. `Prenumeratos` uses this: the tiles are square-ish and uniform, and
        // a subscription is recognised by its show artwork rather than read.
        let elements = tiles.map { CPListImageRowItemGridElement(image: $0.image) }
        rowItem = CPListImageRowItem(
          text: nil, gridElements: elements, allowsMultipleLines: true)

      case .imageGrid:
        // Cover with its title beneath — the same shape the legacy path draws, so on this
        // style the two branches differ in tile count rather than in appearance. No subtitle:
        // this element type has no slot for one.
        let elements = tiles.map { tile in
          CPListImageRowItemImageGridElement(
            image: tile.image, imageShape: .roundedRectangle, title: tile.title,
            accessorySymbolName: nil)
        }
        rowItem = CPListImageRowItem(
          text: nil, imageGridElements: elements, allowsMultipleLines: true)

      case .condensed:
        // Image left, title and subtitle stacked to its right. Wider tiles than `.imageGrid`,
        // so fewer fit per line — the trade for keeping the subtitle.
        let elements = tiles.map { tile in
          CPListImageRowItemCondensedElement(
            image: tile.image, imageShape: .roundedRectangle, title: tile.title,
            subtitle: tile.subtitle, accessorySymbolName: nil)
        }
        rowItem = CPListImageRowItem(
          text: nil, condensedElements: elements, allowsMultipleLines: true)
      }
    } else {
      // Tile *shape* is honoured only on iOS 26+ — below it there is one construction, so a
      // driver on iOS 25 sees every grid in the same shape. Whether tiles carry a title does
      // survive, because the legacy row has a titled and an untitled initialiser.
      rowItem = Self.makeLegacyImageRow(tiles, showsTitles: style.showsTitles)
    }

    rowItem.listImageRowHandler = { _, index, completion in
      Task {
        onSelect(index)
        completion()
      }
    }
    return rowItem
  }

  /// The pre-iOS 26 image-row construction, split out so its use of the array-based
  /// initialisers — superseded by typed elements in iOS 26 — does not warn at every call site.
  /// Titles under each image only arrived in 17.4; below that the grid is images alone, which
  /// is also what `showsTitles: false` asks for at any version.
  @available(
    iOS, introduced: 14.0, deprecated: 26.0,
    message: "Superseded by CPListImageRowItem's element initialisers."
  )
  private static func makeLegacyImageRow(_ tiles: [GridTile], showsTitles: Bool)
    -> CPListImageRowItem
  {
    let images = tiles.map(\.image)
    if showsTitles, #available(iOS 17.4, *) {
      return CPListImageRowItem(text: "", images: images, imageTitles: tiles.map(\.title))
    }
    return CPListImageRowItem(text: "", images: images)
  }

  /// Builds the up-next queue entry for a podcast episode.
  ///
  /// The stream URL lives in the episode's article payload, so hydrating a whole category would
  /// cost one request per episode. The entry carries only the article id and `PlayerController`
  /// resolves it when playback reaches the row.
  static func queueItem(for episode: PodcastEpisode, categoryTitle: String) -> CarPlayItem {
    var cover: String?
    if let prefix = episode.imgPathPrefix, let postfix = episode.imgPathPostfix {
      cover = "https://lrt.lt\(prefix)282x158\(postfix)"
    }
    return CarPlayItem(
      title: episode.title ?? "",
      content: categoryTitle,
      cover: cover,
      streamUrl: nil,
      isLive: false,
      channelId: nil,
      articleId: episode.id
    )
  }

  /// Pushes a podcast/subscription episode list. Tapping a row hands back the resolved item
  /// plus the whole list and the tapped index, so the list becomes the up-next queue.
  func showEpisodesList(
    episodes: [PodcastEpisode], categoryTitle: String,
    onEpisodeSelected: @escaping @MainActor (CarPlayItem, [CarPlayItem], Int) -> Void
  ) async {
    guard let interfaceController = self.interfaceController else { return }

    let queue = episodes.map { CarPlayUIManager.queueItem(for: $0, categoryTitle: categoryTitle) }
    let covers = await loadCovers(for: queue)

    var items = [CPListItem]()
    for (index, episode) in episodes.enumerated() {
      let item = CPListItem(text: episode.title ?? "", detailText: nil)
      if let coverUrl = queue[index].cover, let image = covers[coverUrl] {
        item.setImage(image)
      }
      item.handler = { [weak self] _, completion in
        Task { [weak self] in
          guard let self = self else {
            completion()
            return
          }

          // Fetch episode info to get stream URL
          guard let episodeId = episode.id else {
            completion()
            return
          }

          do {
            let episodeInfo = try await CarPlayService.shared.fetchEpisodeInfo(
              episodeId: episodeId
            )

            guard let streamUrl = episodeInfo.info?.streamUrl, !streamUrl.isEmpty else {
              self.showErrorAlert()
              completion()
              return
            }

            let carPlayItem = CarPlayItem(
              title: queue[index].title,
              content: queue[index].content,
              cover: queue[index].cover,
              streamUrl: streamUrl,
              isLive: false,
              channelId: nil,
              articleId: episodeId
            )
            onEpisodeSelected(carPlayItem, queue, index)
          } catch {
            self.showErrorAlert()
          }

          completion()
        }
      }
      items.append(item)
    }

    let listTemplate = CPListTemplate(
      title: categoryTitle, sections: [CPListSection(items: items)])
    interfaceController.pushTemplate(listTemplate, animated: true, completion: nil)
  }

  func showNowPlayingTemplate(isLive: Bool) {
    if nowPlayingTemplate == nil {
      nowPlayingTemplate = CPNowPlayingTemplate.shared
      nowPlayingTemplate?.isUpNextButtonEnabled = false
      nowPlayingTemplate?.isAlbumArtistButtonEnabled = false
    }

    if isLive {
      nowPlayingTemplate?.updateNowPlayingButtons([])
    } else {
      let backwardButton = CPNowPlayingImageButton(image: UIImage(systemName: "gobackward.15")!) {
        [weak self] _ in
        self?.backwardButtonHandler?()
      }
      let forwardButton = CPNowPlayingImageButton(image: UIImage(systemName: "goforward.15")!) {
        [weak self] _ in
        self?.forwardButtonHandler?()
      }
      let speedButton = CPNowPlayingImageButton(
        image: Self.playbackRateImage(rate: PlayerController.shared.playbackRate)
      ) { [weak self] _ in
        if let newRate = self?.playbackRateHandler?() {
          self?.updatePlaybackRateButton(rate: newRate, isLive: false)
        }
      }
      nowPlayingTemplate?.updateNowPlayingButtons([backwardButton, speedButton, forwardButton])
    }

    if interfaceController?.topTemplate !== nowPlayingTemplate {
      interfaceController?.pushTemplate(nowPlayingTemplate!, animated: true, completion: nil)
    }
  }

  func showErrorAlert() {
    let alert = CPAlertTemplate(
      titleVariants: ["Įvyko klaida"],
      actions: [
        CPAlertAction(title: "Uždaryti", style: .cancel) { _ in
          self.interfaceController?.dismissTemplate(animated: true, completion: nil)
        }
      ]
    )
    self.interfaceController?.presentTemplate(alert, animated: true, completion: nil)
  }

  nonisolated static func loadImage(from urlString: String) async -> UIImage? {
    guard let url = URL(string: urlString) else { return nil }

    do {
      let (data, _) = try await URLSession.shared.data(from: url)
      return UIImage(data: data)
    } catch {
      print("Failed to load image: \(error.localizedDescription)")
      return nil
    }
  }

  func setBackwardButtonHandler(_ handler: @escaping () -> Void) {
    backwardButtonHandler = handler
  }

  func setForwardButtonHandler(_ handler: @escaping () -> Void) {
    forwardButtonHandler = handler
  }

  func setPlaybackRateHandler(_ handler: @escaping () -> Float) {
    playbackRateHandler = handler
  }

  private func updatePlaybackRateButton(rate: Float, isLive: Bool) {
    guard !isLive else { return }
    showNowPlayingTemplate(isLive: false)
  }

  private static func playbackRateImage(rate: Float) -> UIImage {
    let name: String
    if rate == 1.25 {
      name = "playback-1.25x"
    } else if rate == 1.5 {
      name = "playback-1.5x"
    } else {
      name = "playback-1x"
    }
    return (UIImage(named: name) ?? UIImage()).withRenderingMode(.alwaysTemplate)
  }
}
