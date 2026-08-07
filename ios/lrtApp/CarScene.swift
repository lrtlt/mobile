import AVFoundation
import CarPlay
import Combine
import FirebaseAnalytics
import Foundation
import MediaPlayer
import UIKit

class CarSceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate, CPTabBarTemplateDelegate {
  private var interfaceController: CPInterfaceController?

  private let player = PlayerController.shared
  private let playlist = Playlist.shared
  private let cache = CarPlayCache.shared

  private var uiManager: CarPlayUIManager?

  // Used to track connection time. To avoid duplicated events on simulator
  private var connectedAt: Date?

  private var watchHistoryObserver: NSObjectProtocol?
  private var nowPlayingObserver: NSObjectProtocol?

  /// A loaded tab that renders a `Klausykite toliau` section.
  ///
  /// Home and Mano LRT both carry one, and both have to repaint off the single
  /// `watchHistoryUpdated` notification. A host therefore stores the closure that rebuilds its
  /// own sections *around* the continue-playing section rather than the built rows themselves:
  /// a `CPListItem` belongs to one section at a time, so the two tabs can never share instances,
  /// and rebuilding from the cached model keeps neither of them stale.
  private struct ContinuePlayingHost {
    weak var template: CPListTemplate?
    let makeSections: @MainActor (CPListSection?) -> [CPListSection]
  }

  private var continuePlayingHosts: [CarPlayTab: ContinuePlayingHost] = [:]

  /// Identity of the continue-playing data last painted. `watchHistoryUpdated` fires every 10s
  /// while audio plays, and most ticks carry unchanged data — repainting on those would reset
  /// the list the driver is looking at, twice over now that two tabs host the section.
  private var paintedContinuePlayingSignature: String?

  private static let continuePlayingVisibleCount = 3

  /// Tiles in Home's `Naujausi` grid. The rest of the feed is behind that section's `Daugiau`
  /// row, so this bounds what Home shows rather than what it can reach. Lower than it was
  /// because the section now draws `.condensed` tiles, which are far wider than the
  /// `.imageGrid` ones it used to draw and so wrap into many more lines at the same count.
  private static let newestGridTileCount = 6

  /// The logged-out `Mano LRT` copy, byte-identical to Android Auto's `LOGGED_OUT_TITLE` and
  /// `LOGGED_OUT_BODY` — same words, same split, both platforms.
  ///
  /// Sized against what was measured in a car: this title slot is one ellipsizing line of about
  /// 35 characters, and Android Auto's row title wraps to two lines of about 86. At 32 and 34
  /// characters these clear both, which is why neither slot carries fallback variants any more —
  /// a ladder only earns its keep when the preferred string might not fit.
  private static let loggedOutTitle = "Prisijunkite LRT.lt programėlėje"
  private static let loggedOutSubtitle = "Mėgaukitės dar patogesne patirtimi"

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didConnect interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller connected")
    Analytics.logEvent("carplay_connected", parameters: nil)
    self.interfaceController = interfaceController
    self.connectedAt = Date()

    uiManager = CarPlayUIManager(interfaceController: interfaceController)
    uiManager?.setupInitialUI(delegate: self, initialTab: restorableTab())

    watchHistoryObserver = NotificationCenter.default.addObserver(
      forName: .watchHistoryUpdated, object: nil, queue: .main
    ) { [weak self] _ in
      self?.refreshContinuePlayingSections()
    }

    // Keep the Now Playing template's button set in sync when PlayerController changes
    // track (e.g. next/prev pressed from the dashboard widget, or auto-advance).
    nowPlayingObserver = NotificationCenter.default.addObserver(
      forName: .nowPlayingItemChanged, object: nil, queue: .main
    ) { [weak self] _ in
      guard let self = self, self.interfaceController != nil else { return }
      self.uiManager?.showNowPlayingTemplate(isLive: self.playlist.current?.isLive ?? false)
    }

    // Remote command handlers now live on PlayerController.shared for the whole app
    // lifetime (so the dashboard Music widget works without opening the app). Here we only
    // wire up the CarPlay Now Playing template's custom buttons.
    setupTemplateButtons()

    // Attempt to resume playback if state exists
    if cache.getShouldResumePlayer(),
      player.isReadyToPlay
    {
      player.play()
      uiManager?.showNowPlayingTemplate(isLive: playlist.current?.isLive ?? false)
    }
  }

  /// The tab to restore into, from the title `CarPlayCache` kept for the last session.
  ///
  /// `Naujausi` stopped existing, so a returning user can hold a value that matches no template;
  /// `CarPlayTab.migrating(title:)` maps it onto its replacement and resolves anything else
  /// unrecognised to nil, which lands on the first tab.
  private func restorableTab() -> CarPlayTab? {
    guard let title = cache.getCurrentTemplateTitle(),
      let tab = CarPlayTab.migrating(title: title)
    else {
      return nil
    }

    // Restoring into Mano LRT while logged out would make a dead-end login message the first
    // thing the driver sees.
    if tab == .manoLRT, !CarPlayService.shared.isLoggedIn() {
      return .home
    }
    return tab
  }

  private func setupTemplateButtons() {
    uiManager?.setBackwardButtonHandler { [weak self] in
      self?.player.seekBackward()
    }
    uiManager?.setForwardButtonHandler { [weak self] in
      self?.player.seekForward()
    }
    uiManager?.setPlaybackRateHandler { [weak self] in
      return self?.player.cyclePlaybackRate() ?? 1.0
    }
  }

  // MARK: - Tab dispatch

  func tabBarTemplate(_ tabBarTemplate: CPTabBarTemplate, didSelect selectedTemplate: CPTemplate) {
    guard let listTemplate = selectedTemplate as? CPListTemplate else { return }

    print("Selected tab: \(listTemplate.title ?? "?")")
    cache.setCurrentTemplateTitle(listTemplate.title)

    // Switching over the enum keeps the compiler on the hook for the next rename: an
    // unrecognised title used to fall through to an empty list with no error and no log.
    guard let tab = CarPlayTab(rawValue: listTemplate.title ?? "") else {
      print("Unknown tab selected: \(listTemplate.title ?? "?")")
      return
    }

    // Keyed off `analyticsKey` rather than the title, which is not a legal Firebase event name
    // for every tab — `Mano LRT` has a space, `Siūlome` a `ū`. Logging after the guard also
    // means an unrecognised title no longer mints an event nothing will ever query.
    Analytics.logEvent("carplay_tab_open_\(tab.analyticsKey)", parameters: nil)

    switch tab {
    case .home:
      Task { await loadHome(into: listTemplate) }
    case .live:
      Task { await loadLive(into: listTemplate) }
    case .podcasts:
      Task { await loadPodcasts(into: listTemplate) }
    case .manoLRT:
      Task { await loadManoLRT(into: listTemplate) }
    }
  }

  // MARK: - Siūlome (Home)

  /// Home is three sections: `Klausykite toliau` as rows, then `Siūlome` and `Naujausi` as a
  /// grid each, with the `Atnaujinti` row last. Only the first is auth-dependent, and it is
  /// simply absent when there is nothing to continue — Home renders for a logged-out driver.
  private func loadHome(into template: CPListTemplate) async {
    do {
      async let newestFetch = CarPlayService.shared.fetchNewest()
      async let recommendedFetch = CarPlayService.shared.fetchRecommended()
      let newest = try await newestFetch
      let recommended = try await recommendedFetch

      guard let uiManager = uiManager else { return }
      let covers = await uiManager.loadCovers(for: newest + recommended)

      continuePlayingHosts[.home] = ContinuePlayingHost(template: template) {
        [weak self, weak template] continuePlayingSection in
        guard let self = self, let uiManager = self.uiManager else { return [] }

        var sections: [CPListSection] = []

        // 1. Klausykite toliau — omitted entirely when there is nothing to continue, in which
        // case Siūlome takes the top of the tab.
        if let continuePlayingSection = continuePlayingSection {
          sections.append(continuePlayingSection)
        }

        // 2. Siūlome — condensed tiles, the same shape `Naujausi` below now draws. Uncapped:
        // the recommendations list is short and curated, unlike the newest feed, so there is
        // nothing to hold back behind a drill-in.
        let recommendedGrid = uiManager.makeImageRowItem(
          from: recommended, covers: covers, style: .condensed
        ) {
          [weak self] selected, shown in
          guard let self = self else { return }
          self.playlist.setQueue(shown, startingWith: selected)
          self.onPlayableItemSelected(from: selected)
        }
        sections.append(
          CPListSection(
            items: [recommendedGrid.row], header: "Siūlome", sectionIndexTitle: nil))

        // 3. Naujausi — a grid of the newest items, capped at `newestGridTileCount`. The feed
        // returns far more than that, so `Daugiau` is effectively always present here and is
        // the route to the rest.
        //
        // Same `.condensed` tiles as `Siūlome` above: the two sections deliberately looked
        // different before, and now deliberately do not. Their headers are what separates the
        // curated row from the feed.
        //
        // `Daugiau` is still conditional rather than hardcoded, because the condition is what
        // is actually true: it appears when the grid could not show everything. Below iOS 26
        // the system caps tiles lower still, and an item whose cover failed to download is
        // dropped at any version — both cases are already covered by the same test.
        //
        // `Atnaujinti` rides at the end of this section because it is the last section, and it
        // reloads all three — it is scoped to the tab, not to Naujausi, and being the final row
        // of the tab is what says so.
        //
        // With both content sections collapsed to a single row each, Home has no open-ended
        // section at all: the recommended grid + the newest grid + an optional `Daugiau` + at
        // most 4 continue-playing + `Atnaujinti`. Nothing here needs the row budget any more.
        let newestGrid = uiManager.makeImageRowItem(
          from: newest, covers: covers, style: .condensed, limit: Self.newestGridTileCount
        ) {
          [weak self] selected, shown in
          guard let self = self else { return }
          self.playlist.setQueue(shown, startingWith: selected)
          self.onPlayableItemSelected(from: selected)
        }
        var newestRows: [any CPListTemplateItem] = [newestGrid.row]
        if newestGrid.shown.count < newest.count {
          newestRows.append(
            self.makeUtilityRow(text: "Daugiau") { [weak self] in
              await self?.showFullNewestList(items: newest, covers: covers)
            })
        }
        newestRows.append(
          self.makeUtilityRow(text: "Atnaujinti", accessoryType: .none) { [weak self] in
            guard let self = self, let template = template else { return }
            await self.loadHome(into: template)
          })
        sections.append(
          CPListSection(items: newestRows, header: "Naujausi", sectionIndexTitle: nil))

        return sections
      }

      applyContinuePlayingSections()
      Task { await CarPlayService.shared.refreshContinuePlaying() }
    } catch {
      // Drop the host first: a watch-history tick must not repaint over the retry row.
      continuePlayingHosts[.home] = nil
      showLoadError(in: template) { [weak self, weak template] in
        guard let self = self, let template = template else { return }
        await self.loadHome(into: template)
      }
    }
  }

  /// The full newest list behind the `Naujausi` section's `Daugiau` row, including the items the
  /// grid already showed and the ones it could not.
  private func showFullNewestList(items: [CarPlayItem], covers: [String: UIImage]) async {
    guard let uiManager = uiManager, let interfaceController = interfaceController else { return }

    let rows = uiManager.makeListItems(from: items, covers: covers) { [weak self] selected in
      guard let self = self else { return }
      self.playlist.setQueue(items, startingWith: selected)
      self.onPlayableItemSelected(from: selected)
    }
    let template = CPListTemplate(title: "Naujausi", sections: [CPListSection(items: rows)])
    interfaceController.pushTemplate(template, animated: true, completion: nil)
  }

  // MARK: - Tiesiogiai

  private func loadLive(into template: CPListTemplate) async {
    do {
      let items = try await CarPlayService.shared.fetchLive()
      guard let uiManager = uiManager else { return }

      let rows = await uiManager.createListItems(from: items) { [weak self] selected in
        guard let self = self else { return }
        self.playlist.setQueue(items, startingWith: selected)
        self.onPlayableItemSelected(from: selected)
      }
      template.updateSections([CPListSection(items: rows)])
    } catch {
      showLoadError(in: template) { [weak self, weak template] in
        guard let self = self, let template = template else { return }
        await self.loadLive(into: template)
      }
    }
  }

  // MARK: - ManoLRT

  private func loadManoLRT(into template: CPListTemplate) async {
    guard CarPlayService.shared.isLoggedIn() else {
      // Nothing else at all: no continue playing, no subscriptions. The A–Z browse is not
      // lost with them — it lives in the `Laidos` tab, which has no auth dependency.
      continuePlayingHosts[.manoLRT] = nil
      showLoggedOut(in: template)
      // Still refresh: logged out this clears the cache and posts, which blanks Home's
      // `Klausykite toliau` instead of leaving a stale section behind.
      Task { await CarPlayService.shared.refreshContinuePlaying() }
      return
    }

    // Clear the login prompt: the variants persist on the template across reloads, and Mano LRT
    // can now legitimately end up with zero rows — a driver who has just signed in and has
    // neither history nor subscriptions would otherwise be told to sign in again.
    template.emptyViewTitleVariants = []

    let subscriptions = await activeSubscriptions()
    // Subscriptions carry no artwork, so a cover is borrowed from each category's newest
    // episode — one request per subscription, cached for the session.
    let coverUrls = await CarPlayService.shared.fetchSubscriptionCovers(for: subscriptions)
    guard let uiManager = uiManager else { return }
    let coverImages = await uiManager.loadCovers(urls: Array(coverUrls.values))
    let subscriptionCovers = coverUrls.compactMapValues { coverImages[$0] }

    continuePlayingHosts[.manoLRT] = ContinuePlayingHost(template: template) {
      [weak self] continuePlayingSection in
      guard let self = self, let uiManager = self.uiManager else { return [] }

      var sections: [CPListSection] = []

      // 1. Klausykite toliau — same shape as Home, omitted when empty.
      if let continuePlayingSection = continuePlayingSection {
        sections.append(continuePlayingSection)
      }

      // 2. Prenumeratos — a grid of covers and nothing else: no title under a tile, no
      // subtitle. Omitted when there are none and when the fetch fails. The row that used to
      // keep this section alive regardless (`Visos laidos`) moved out to the `Laidos` tab, so
      // an empty section would now be a bare header over nothing.
      //
      // As a grid the section is one row rather than one per subscription, so it no longer
      // competes for the template's item budget — which it used to lose, silently dropping
      // subscriptions past the cap. Uncapped here for the same reason: nothing else in the app
      // lists a driver's subscriptions, so a tile that is not drawn is a subscription that
      // cannot be reached from `Mano LRT` at all.
      let subscriptionGrid = uiManager.makeSubscriptionRow(
        from: subscriptions, covers: subscriptionCovers, style: .grid
      ) { [weak self] subscription in
        guard let self = self, let categoryId = subscription.categoryId else { return }
        Task {
          await self.showEpisodes(
            categoryId: categoryId, categoryTitle: subscription.name ?? "")
        }
      }
      if !subscriptionGrid.shown.isEmpty {
        sections.append(
          CPListSection(
            items: [subscriptionGrid.row], header: "Prenumeratos", sectionIndexTitle: nil))
      }

      return sections
    }

    applyContinuePlayingSections()
    Task { await CarPlayService.shared.refreshContinuePlaying() }
  }

  /// Active **audio** subscriptions, or an empty list when the fetch fails. A network error is not
  /// distinguished from having none: both drop the `Prenumeratos` section, and the A–Z browse
  /// stays reachable from its own tab either way.
  ///
  /// Video subscriptions are dropped because the same subscription list backs the phone app, where
  /// following a mediateka show is legitimate — there is just nothing to play from one here.
  /// Filtered before the covers are fetched, so a dropped tile costs no request either.
  private func activeSubscriptions() async -> [UserSubscription] {
    do {
      let active = try await CarPlayService.shared.fetchSubscriptions().filter { $0.isActive }
      return await CategoryMediaTypeResolver.shared.keepAudio(active)
    } catch {
      print("Failed to load subscriptions: \(error.localizedDescription)")
      return []
    }
  }

  private func showLoggedOut(in template: CPListTemplate) {
    // `CPListTemplate` documents the empty view as rendering whenever `itemCount == 0`, with no
    // exception for a template that is a tab-bar root, and removes it by itself once items
    // arrive. So the message *is* the empty view and the list stays genuinely empty — adding a
    // placeholder row would make `itemCount == 1` and suppress the very thing it was meant to
    // stand in for.
    //
    // Both slots are used: the title is a single ellipsizing line, so anything beyond a short
    // headline has to live in the subtitle. One variant each — see `loggedOutTitle`.
    template.emptyViewTitleVariants = [Self.loggedOutTitle]
    template.emptyViewSubtitleVariants = [Self.loggedOutSubtitle]
    template.updateSections([])
  }

  // MARK: - Podcasts

  /// The A–Z podcast browse, rendered into the `Laidos` tab.
  ///
  /// It has no auth dependency, so podcasts stay reachable from CarPlay for a logged-out
  /// driver — which is why `Mano LRT` no longer needs to carry a route into the browse.
  private func loadPodcasts(into template: CPListTemplate) async {
    do {
      let categories = try await CarPlayService.shared.fetchPodcasts()

      // Group categories by first letter
      let groupedCategories = Dictionary(grouping: categories) { category in
        String((category.title ?? "").trimmingCharacters(in: .punctuationCharacters).first ?? "#")
          .uppercased()
      }

      // Sort sections alphabetically
      let sections = groupedCategories.keys.sorted().map { letter in
        let items = (groupedCategories[letter] ?? []).map { category -> CPListItem in
          let item = CPListItem(text: category.title ?? "", detailText: nil)
          item.accessoryType = .disclosureIndicator
          item.handler = { [weak self] _, completion in
            Task {
              guard let self = self, let categoryId = category.id else {
                completion()
                return
              }
              await self.showEpisodes(categoryId: categoryId, categoryTitle: category.title ?? "")
              completion()
            }
          }
          return item
        }
        return CPListSection(items: items, header: letter, sectionIndexTitle: letter)
      }

      template.updateSections(sections)
    } catch {
      // A tab gets the same retry row as the others, rather than the alert this used when it
      // was a pushed template — there is nothing to dismiss back to.
      showLoadError(in: template) { [weak self, weak template] in
        guard let self = self, let template = template else { return }
        await self.loadPodcasts(into: template)
      }
    }
  }

  /// Pushes a category's episode list. The list becomes the up-next queue on tap, and the
  /// stream-resolved copy of the tapped episode is written back into it so `Playlist.current`
  /// matches what is audible.
  private func showEpisodes(categoryId: Int, categoryTitle: String) async {
    guard let uiManager = uiManager else { return }

    do {
      let episodes = try await CarPlayService.shared.fetchEpisodes(categoryId: categoryId)
      await uiManager.showEpisodesList(episodes: episodes, categoryTitle: categoryTitle) {
        [weak self] item, queue, index in
        guard let self = self else { return }
        self.playlist.setQueue(queue, startingAt: index)
        self.playlist.replaceItem(at: index, with: item)
        self.onPlayableItemSelected(from: item)
      }
    } catch {
      print("Failed to fetch episodes: \(error.localizedDescription)")
      uiManager.showErrorAlert()
    }
  }

  // MARK: - Klausykite toliau

  /// Repaints every loaded host, skipping the work when the cached data is unchanged.
  private func refreshContinuePlayingSections() {
    let signature = Self.signature(for: CarPlayService.shared.cachedContinuePlaying)
    guard signature != paintedContinuePlayingSignature else { return }
    applyContinuePlayingSections()
  }

  /// Rebuilds both hosts from the one cached continue-playing array.
  ///
  /// Cover images are downloaded once for the whole pass — the two tabs need their own
  /// `CPListItem` instances but can share the images behind them.
  private func applyContinuePlayingSections() {
    guard !continuePlayingHosts.isEmpty, let uiManager = uiManager else { return }

    let items = CarPlayService.shared.cachedContinuePlaying
    let visible = Array(items.prefix(Self.continuePlayingVisibleCount))

    Task { [weak self] in
      guard let self = self else { return }
      let covers = await uiManager.loadCovers(for: visible)

      let hosts = self.continuePlayingHosts
      for (tab, host) in hosts {
        guard let template = host.template else {
          self.continuePlayingHosts[tab] = nil
          continue
        }
        let section = self.makeContinuePlayingSection(
          items: items, visible: visible, covers: covers)
        template.updateSections(host.makeSections(section))
      }

      self.paintedContinuePlayingSignature = Self.signature(for: items)
    }
  }

  /// Builds a fresh `Klausykite toliau` section, or nil when there is nothing to continue.
  private func makeContinuePlayingSection(
    items: [CarPlayItem], visible: [CarPlayItem], covers: [String: UIImage]
  ) -> CPListSection? {
    guard !visible.isEmpty, let uiManager = uiManager else { return nil }

    let rows = uiManager.makeListItems(from: visible, covers: covers) { [weak self] selected in
      guard let self = self else { return }
      self.playlist.setQueue(items, startingWith: selected)
      self.onPlayableItemSelected(from: selected)
    }
    for (idx, row) in rows.enumerated() where idx < visible.count {
      let pct = visible[idx].progressPct ?? 0
      row.playbackProgress = CGFloat(max(0, min(1, pct)))
    }

    var sectionItems = rows
    if items.count > Self.continuePlayingVisibleCount {
      sectionItems.append(
        makeUtilityRow(text: "Daugiau") { [weak self] in
          await self?.showAllContinuePlaying(items: items)
        })
    }

    return CPListSection(
      items: sectionItems, header: "Klausykite toliau", sectionIndexTitle: nil)
  }

  private func showAllContinuePlaying(items: [CarPlayItem]) async {
    guard let uiManager = uiManager, let interfaceController = interfaceController else { return }

    let cpItems = await uiManager.createListItems(from: items) { [weak self] selected in
      guard let self = self else { return }
      self.playlist.setQueue(items, startingWith: selected)
      self.onPlayableItemSelected(from: selected)
    }
    for (idx, cpItem) in cpItems.enumerated() where idx < items.count {
      let pct = items[idx].progressPct ?? 0
      cpItem.playbackProgress = CGFloat(max(0, min(1, pct)))
    }
    let template = CPListTemplate(
      title: "Klausykite toliau", sections: [CPListSection(items: cpItems)])
    interfaceController.pushTemplate(template, animated: true, completion: nil)
  }

  private static func signature(for items: [CarPlayItem]) -> String {
    return items.map { "\($0.articleId ?? 0):\($0.progressPct ?? 0)" }.joined(separator: ",")
  }

  // MARK: - Rows

  /// A row that navigates or refreshes rather than plays. Utility rows (`Atnaujinti`,
  /// `Daugiau`) are never queue members, so they can never shift `currentIndex`. `Daugiau`
  /// labels the drill-in in both `Naujausi` and `Klausykite toliau` — same job, and each is
  /// scoped to its own section.
  private func makeUtilityRow(
    text: String, accessoryType: CPListItemAccessoryType = .disclosureIndicator,
    action: @escaping @MainActor () async -> Void
  ) -> CPListItem {
    let item = CPListItem(text: text, detailText: nil)
    item.accessoryType = accessoryType
    item.handler = { _, completion in
      Task {
        await action()
        completion()
      }
    }
    return item
  }

  private func showLoadError(
    in template: CPListTemplate, retry: @escaping @MainActor () async -> Void
  ) {
    let item = CPListItem(
      text: "Įvyko klaida! Patikrinkite interneto ryšį",
      detailText: "Paspauskite norėdami pabandyti dar kartą"
    )
    item.handler = { _, completion in
      Task {
        await retry()
        completion()
      }
    }
    template.updateSections([CPListSection(items: [item])])
  }

  // MARK: - Lifecycle

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didDisconnectInterfaceController interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller disconnected")
    Analytics.logEvent("carplay_disconnected", parameters: nil)
    saveState()
    player.pause()
    RDSNowPlayingService.shared.stopListening()
    // Note: remote command handlers are intentionally NOT cleared here. They live on
    // PlayerController.shared for the app's lifetime so the persistent CarPlay dashboard
    // Music widget keeps responding after the template scene disconnects.
    if let observer = watchHistoryObserver {
      NotificationCenter.default.removeObserver(observer)
      watchHistoryObserver = nil
    }
    if let observer = nowPlayingObserver {
      NotificationCenter.default.removeObserver(observer)
      nowPlayingObserver = nil
    }
    continuePlayingHosts.removeAll()
    paintedContinuePlayingSignature = nil
    self.interfaceController = nil
  }

  private func saveState() {
    if let connectedAt = connectedAt,
      Date().timeIntervalSince(connectedAt) > 2
    {
      print("Should resume player: \(player.isPlaying)")
      cache.setShouldResumePlayer(player.isPlaying)
    } else {
      print("Not connected for more than 2 seconds")
    }
  }

  private func onPlayableItemSelected(from selectedItem: CarPlayItem) {
    do {
      try player.setupStream(for: selectedItem)
      uiManager?.showNowPlayingTemplate(isLive: selectedItem.isLive == true)
    } catch {
      print("Error loading stream: \(error.localizedDescription)")
      uiManager?.showErrorAlert()
    }
  }
}
