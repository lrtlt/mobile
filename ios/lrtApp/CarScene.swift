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
  private var tabLoadTask: Task<Void, Never>?

  /// Home, the one tab that renders a `Klausykite toliau` section.
  ///
  /// It has to repaint off the `watchHistoryUpdated` notification without losing the sections
  /// around it, so the host stores the closure that rebuilds Home *around* the continue-playing
  /// section rather than the built rows themselves. Mano LRT used to carry a copy of the section
  /// too, which is why this was once a per-tab dictionary; a single host is all that is left.
  private struct ContinuePlayingHost {
    weak var template: CPListTemplate?
    let makeSections: @MainActor (CPListSection?) -> [CPListSection]
  }

  private var continuePlayingHost: ContinuePlayingHost?

  /// Article-id identity of the continue-playing data last painted. Progress-only ticks must
  /// not rebuild the section — that resets the list the driver is looking at — so they update
  /// `playbackProgress` on these stored rows instead.
  private var paintedContinuePlayingIdentity: String?
  private var paintedContinuePlayingRows: [CPListItem] = []
  private var continuePlayingPaintGeneration = 0

  private static let continuePlayingVisibleCount = 3

  /// Rows in Home's `Siūlome` and `Naujausi` sections. Both are lists rather than grids, so the
  /// cap is what keeps the tab scannable — the rest of each feed is one `Daugiau` row away, so
  /// this bounds what Home shows rather than what it can reach.
  private static let homeSectionVisibleCount = 4

  /// The logged-out `Mano LRT` copy, byte-identical to Android Auto's `LOGGED_OUT_TITLE` and
  /// `LOGGED_OUT_BODY` — same words, same split, both platforms.
  ///
  /// Sized against what was measured in a car: this title slot is one ellipsizing line of about
  /// 35 characters, and Android Auto's row title wraps to two lines of about 86. At 32 and 34
  /// characters these clear both, which is why neither slot carries fallback variants any more —
  /// a ladder only earns its keep when the preferred string might not fit.
  private static let loggedOutTitle = "Prisijunkite LRT.lt programėlėje"
  private static let loggedOutSubtitle = "Mėgaukitės dar patogesne patirtimi"

  /// Byte-identical to Android Auto's `EMPTY_SUBSCRIPTIONS_TITLE` / `EMPTY_SUBSCRIPTIONS_BODY`.
  private static let emptySubscriptionsTitle = "Neturite prenumeratų"
  private static let emptySubscriptionsSubtitle = "Prenumeruokite laidas programėlėje"

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
      self?.refreshContinuePlayingSection()
    }

    // Keep the Now Playing template's button set in sync when PlayerController changes
    // track (e.g. next/prev pressed from the dashboard widget, or auto-advance).
    nowPlayingObserver = NotificationCenter.default.addObserver(
      forName: .nowPlayingItemChanged, object: nil, queue: .main
    ) { [weak self] _ in
      guard let self = self, self.interfaceController != nil else { return }
      self.uiManager?.updateNowPlayingButtons(isLive: self.playlist.current?.isLive ?? false)
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

    startTabLoad {
      switch tab {
      case .home:
        await self.loadHome(into: listTemplate)
      case .live:
        await self.loadLive(into: listTemplate)
      case .podcasts:
        await self.loadPodcasts(into: listTemplate)
      case .manoLRT:
        await self.loadManoLRT(into: listTemplate)
      }
    }
  }

  private func startTabLoad(_ work: @escaping @MainActor () async -> Void) {
    tabLoadTask?.cancel()
    tabLoadTask = Task { @MainActor in
      await work()
    }
  }

  private static func isCancellation(_ error: Error) -> Bool {
    if error is CancellationError { return true }
    if let urlError = error as? URLError, urlError.code == .cancelled { return true }
    return false
  }

  // MARK: - Siūlome (Home)

  /// Home is three sections of the same shape — `Klausykite toliau`, `Siūlome`, `Naujausi`, each
  /// a short list of rows over a `Daugiau` drill-in — with the `Atnaujinti` row last. Only the
  /// first is auth-dependent, and it is simply absent when there is nothing to continue, so Home
  /// renders for a logged-out driver.
  private func loadHome(into template: CPListTemplate, forceRefresh: Bool = false) async {
    do {
      async let newestFetch = CarPlayService.shared.fetchNewest()
      async let recommendedFetch = CarPlayService.shared.fetchRecommended(ignoreCache: forceRefresh)
      let newest = try await newestFetch
      let recommended = try await recommendedFetch
      guard !Task.isCancelled else { return }

      guard let uiManager = uiManager else { return }
      let covers = await uiManager.loadCovers(for: newest + recommended)
      guard !Task.isCancelled else { return }

      continuePlayingHost = ContinuePlayingHost(template: template) {
        [weak self, weak template] continuePlayingSection in
        guard let self = self else { return [] }

        var sections: [CPListSection] = []

        // 1. Klausykite toliau — omitted entirely when there is nothing to continue, in which
        // case Siūlome takes the top of the tab.
        if let continuePlayingSection = continuePlayingSection {
          sections.append(continuePlayingSection)
        }

        // 2. Siūlome and 3. Naujausi — both drawn the same way `Klausykite toliau` above is:
        // a short list of rows, capped at `homeSectionVisibleCount`, over a `Daugiau` row that
        // pushes the whole feed. The two sections used to be grids of one row each, and to be
        // shaped differently from the section above them; now all three of Home's sections read
        // alike and their headers are what tells them apart.
        //
        // `Daugiau` stays conditional rather than hardcoded because the condition is what is
        // actually true — `Siūlome` is a short curated feed and can legitimately fit whole,
        // while `Naujausi` returns far more than four and effectively always carries one.
        //
        // Every section is bounded, so Home cannot outgrow the template's item budget: at most
        // 3 + 1 continue-playing rows, 4 + 1 each here, and `Atnaujinti`.
        //
        // Siūlome is dropped when it comes back empty, the same way `Klausykite toliau` above
        // is — a header over nothing is worse than one section fewer. Naujausi always carries
        // `Atnaujinti`, so it is never empty and never needs the test.
        if !recommended.isEmpty {
          sections.append(
            self.makeHomeSection(
              header: "Siūlome", items: recommended, covers: covers, extraRows: []))
        }

        // `Atnaujinti` rides at the end of the last section because it reloads all three — it is
        // scoped to the tab, not to Naujausi, and being the final row of the tab is what says so.
        let refreshRow = self.makeUtilityRow(text: "Atnaujinti", accessoryType: .none) {
          [weak self] in
          guard let self = self, let template = template else { return }
          self.startTabLoad {
            await self.loadHome(into: template, forceRefresh: true)
          }
        }
        sections.append(
          self.makeHomeSection(
            header: "Naujausi", items: newest, covers: covers, extraRows: [refreshRow]))

        return sections
      }

      applyContinuePlayingSection()
      Task { await CarPlayService.shared.refreshContinuePlaying() }
    } catch {
      if Self.isCancellation(error) { return }
      continuePlayingHost = nil
      paintedContinuePlayingIdentity = nil
      paintedContinuePlayingRows = []
      showLoadError(in: template) { [weak self, weak template] in
        guard let self = self, let template = template else { return }
        self.startTabLoad {
          await self.loadHome(into: template, forceRefresh: true)
        }
      }
    }
  }

  /// One of Home's two feed sections: the first `homeSectionVisibleCount` items as rows, a
  /// `Daugiau` drill-in when there are more, then whatever `extraRows` the caller appends.
  ///
  /// Tapping a row queues the *whole* feed rather than the visible slice, matching
  /// `Klausykite toliau` — the cap is about how much of the section is drawn, not about what
  /// playback may run on into.
  private func makeHomeSection(
    header: String, items: [CarPlayItem], covers: [String: UIImage],
    extraRows: [any CPListTemplateItem]
  ) -> CPListSection {
    guard let uiManager = uiManager else {
      return CPListSection(items: extraRows, header: header, sectionIndexTitle: nil)
    }

    let visible = Array(items.prefix(Self.homeSectionVisibleCount))
    var rows: [any CPListTemplateItem] = uiManager.makeListItems(
      from: visible, covers: covers
    ) { [weak self] selected in
      guard let self = self else { return }
      self.playlist.setQueue(items, startingWith: selected)
      self.onPlayableItemSelected(from: selected)
    }

    if items.count > visible.count {
      rows.append(
        makeUtilityRow(text: "Daugiau") { [weak self] in
          await self?.showFullList(title: header, items: items, covers: covers)
        })
    }
    rows.append(contentsOf: extraRows)

    return CPListSection(items: rows, header: header, sectionIndexTitle: nil)
  }

  /// The full feed behind a Home section's `Daugiau` row, including the items the section
  /// already showed.
  private func showFullList(title: String, items: [CarPlayItem], covers: [String: UIImage]) async {
    guard let uiManager = uiManager, let interfaceController = interfaceController else { return }

    let rows = uiManager.makeListItems(from: items, covers: covers) { [weak self] selected in
      guard let self = self else { return }
      self.playlist.setQueue(items, startingWith: selected)
      self.onPlayableItemSelected(from: selected)
    }
    let template = CPListTemplate(title: title, sections: [CPListSection(items: rows)])
    interfaceController.pushTemplate(template, animated: true, completion: nil)
  }

  // MARK: - Tiesiogiai

  private func loadLive(into template: CPListTemplate) async {
    do {
      let items = try await CarPlayService.shared.fetchLive()
      guard !Task.isCancelled else { return }
      guard let uiManager = uiManager else { return }

      let rows = await uiManager.createListItems(from: items) { [weak self] selected in
        guard let self = self else { return }
        self.playlist.setQueue(items, startingWith: selected)
        self.onPlayableItemSelected(from: selected)
      }
      guard !Task.isCancelled else { return }
      template.updateSections([CPListSection(items: rows)])
    } catch {
      if Self.isCancellation(error) { return }
      showLoadError(in: template) { [weak self, weak template] in
        guard let self = self, let template = template else { return }
        self.startTabLoad { await self.loadLive(into: template) }
      }
    }
  }

  // MARK: - ManoLRT

  private func loadManoLRT(into template: CPListTemplate) async {
    guard CarPlayService.shared.isLoggedIn() else {
      // No subscriptions, and nothing else either. The A–Z browse is not lost with them — it
      // lives in the `Laidos` tab, which has no auth dependency.
      showLoggedOut(in: template)
      // Still refresh: logged out this clears the cache and posts, which blanks Home's
      // `Klausykite toliau` instead of leaving a stale section behind.
      Task { await CarPlayService.shared.refreshContinuePlaying() }
      return
    }

    // Clear the login prompt: the variants persist on the template across reloads, and Mano LRT
    // can legitimately end up with zero rows — a driver who has just signed in and has no
    // subscriptions would otherwise be told to sign in again.
    template.emptyViewTitleVariants = []
    template.emptyViewSubtitleVariants = []

    let subscriptions: [UserSubscription]
    do {
      subscriptions = try await activeSubscriptions()
    } catch {
      if Self.isCancellation(error) { return }
      showLoadError(in: template) { [weak self, weak template] in
        guard let self = self, let template = template else { return }
        self.startTabLoad { await self.loadManoLRT(into: template) }
      }
      Task { await CarPlayService.shared.refreshContinuePlaying() }
      return
    }
    guard !Task.isCancelled else { return }

    if subscriptions.isEmpty {
      template.emptyViewTitleVariants = [Self.emptySubscriptionsTitle]
      template.emptyViewSubtitleVariants = [Self.emptySubscriptionsSubtitle]
      template.updateSections([])
      Task { await CarPlayService.shared.refreshContinuePlaying() }
      return
    }

    // Subscriptions carry no artwork, so a cover is borrowed from each category's newest
    // episode — one request per subscription, cached for the session.
    let coverUrls = await CarPlayService.shared.fetchSubscriptionCovers(for: subscriptions)
    guard !Task.isCancelled else { return }
    guard let uiManager = uiManager else { return }
    let coverImages = await uiManager.loadCovers(urls: Array(coverUrls.values))
    guard !Task.isCancelled else { return }
    let subscriptionCovers = coverUrls.compactMapValues { coverImages[$0] }

    // Prenumeratos — a grid of covers and nothing else: no title under a tile, no subtitle.
    //
    // The only section in the tab: `Klausykite toliau` used to sit above it, and now lives in
    // Home alone rather than in both places.
    //
    // As a grid the section is one row rather than one per subscription, so it no longer
    // competes for the template's item budget — which it used to lose, silently dropping
    // subscriptions past the cap. Below iOS 26 the framework still caps tiles at
    // `CPMaximumNumberOfGridImages`, and a subscription with no cover cannot be a tile, so
    // leftovers (and a cover-less list) go behind `Daugiau` or become the section itself.
    let subscriptionGrid = uiManager.makeSubscriptionRow(
      from: subscriptions, covers: subscriptionCovers, style: .grid
    ) { [weak self] subscription in
      guard let self = self, let categoryId = subscription.categoryId else { return }
      Task {
        await self.showEpisodes(
          categoryId: categoryId, categoryTitle: subscription.name ?? "")
      }
    }

    let shownKeys = Set(subscriptionGrid.shown.map(\.subscriptionKey))
    let leftover = subscriptions.filter { !shownKeys.contains($0.subscriptionKey) }

    var sections: [CPListSection] = []
    if !subscriptionGrid.shown.isEmpty {
      var rows: [any CPListTemplateItem] = [subscriptionGrid.row]
      if !leftover.isEmpty {
        rows.append(
          makeUtilityRow(text: "Daugiau") { [weak self] in
            await self?.showSubscriptionList(leftover)
          })
      }
      sections.append(
        CPListSection(
          items: rows, header: "Prenumeratos", sectionIndexTitle: nil))
    } else if !leftover.isEmpty {
      sections.append(
        CPListSection(
          items: makeSubscriptionListItems(leftover),
          header: "Prenumeratos",
          sectionIndexTitle: nil))
    }
    template.updateSections(sections)

    // Home's section is not visible from here any more, but a driver who signed in on the phone
    // arrives with an empty cache — refreshing keeps Home current for when they switch back.
    Task { await CarPlayService.shared.refreshContinuePlaying() }
  }

  /// Active subscriptions, audio and video alike. A network error is thrown so the tab can show
  /// a retry row rather than looking like the driver has no subscriptions.
  ///
  /// A video (mediateka) tile browses exactly like an audio one — the category listing carries
  /// every episode and each one's article payload resolves to a playable stream. Episodes remember
  /// which media type they came from so watch-history progress lands in the right backend bucket.
  private func activeSubscriptions() async throws -> [UserSubscription] {
    return try await CarPlayService.shared.fetchSubscriptions().filter { $0.isActive }
  }

  private func makeSubscriptionListItems(_ subscriptions: [UserSubscription]) -> [CPListItem] {
    return subscriptions.map { subscription in
      let item = CPListItem(text: subscription.name ?? "", detailText: nil)
      item.accessoryType = .disclosureIndicator
      item.handler = { [weak self] _, completion in
        Task {
          guard let self = self, let categoryId = subscription.categoryId else {
            completion()
            return
          }
          await self.showEpisodes(
            categoryId: categoryId, categoryTitle: subscription.name ?? "")
          completion()
        }
      }
      return item
    }
  }

  private func showSubscriptionList(_ subscriptions: [UserSubscription]) async {
    guard let interfaceController = interfaceController else { return }
    let template = CPListTemplate(
      title: "Prenumeratos",
      sections: [CPListSection(items: makeSubscriptionListItems(subscriptions))])
    interfaceController.pushTemplate(template, animated: true, completion: nil)
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
      guard !Task.isCancelled else { return }

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
      if Self.isCancellation(error) { return }
      // A tab gets the same retry row as the others, rather than the alert this used when it
      // was a pushed template — there is nothing to dismiss back to.
      showLoadError(in: template) { [weak self, weak template] in
        guard let self = self, let template = template else { return }
        self.startTabLoad { await self.loadPodcasts(into: template) }
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

  /// Repaints Home when the continue-playing *list* changed. Progress-only ticks update the
  /// existing rows' bars in place so the list the driver is looking at is not reset.
  private func refreshContinuePlayingSection() {
    let items = CarPlayService.shared.cachedContinuePlaying
    let identity = Self.identitySignature(for: items)
    if identity != paintedContinuePlayingIdentity {
      applyContinuePlayingSection()
      return
    }
    updateContinuePlayingProgressBars(items: items)
  }

  private func updateContinuePlayingProgressBars(items: [CarPlayItem]) {
    let visible = Array(items.prefix(Self.continuePlayingVisibleCount))
    for (idx, row) in paintedContinuePlayingRows.enumerated() where idx < visible.count {
      let pct = visible[idx].progressPct ?? 0
      row.playbackProgress = CGFloat(max(0, min(1, pct)))
    }
  }

  /// Rebuilds Home from the cached continue-playing array.
  private func applyContinuePlayingSection() {
    guard let host = continuePlayingHost, let uiManager = uiManager else { return }

    let items = CarPlayService.shared.cachedContinuePlaying
    let visible = Array(items.prefix(Self.continuePlayingVisibleCount))

    continuePlayingPaintGeneration += 1
    let generation = continuePlayingPaintGeneration

    Task { [weak self] in
      guard let self = self else { return }
      let covers = await uiManager.loadCovers(for: visible)
      guard generation == self.continuePlayingPaintGeneration else { return }

      guard let template = host.template else {
        self.continuePlayingHost = nil
        return
      }
      let section = self.makeContinuePlayingSection(
        items: items, visible: visible, covers: covers)
      template.updateSections(host.makeSections(section))

      self.paintedContinuePlayingIdentity = Self.identitySignature(for: items)
    }
  }

  /// Builds a fresh `Klausykite toliau` section, or nil when there is nothing to continue.
  private func makeContinuePlayingSection(
    items: [CarPlayItem], visible: [CarPlayItem], covers: [String: UIImage]
  ) -> CPListSection? {
    guard !visible.isEmpty, let uiManager = uiManager else {
      paintedContinuePlayingRows = []
      return nil
    }

    let rows = uiManager.makeListItems(from: visible, covers: covers) { [weak self] selected in
      guard let self = self else { return }
      self.playlist.setQueue(items, startingWith: selected)
      self.onPlayableItemSelected(from: selected)
    }
    for (idx, row) in rows.enumerated() where idx < visible.count {
      let pct = visible[idx].progressPct ?? 0
      row.playbackProgress = CGFloat(max(0, min(1, pct)))
    }
    paintedContinuePlayingRows = rows

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

  private static func identitySignature(for items: [CarPlayItem]) -> String {
    return items.map { "\($0.articleId ?? 0)" }.joined(separator: ",")
  }

  // MARK: - Rows

  /// A row that navigates or refreshes rather than plays. Utility rows (`Atnaujinti`,
  /// `Daugiau`) are never queue members, so they can never shift `currentIndex`. `Daugiau`
  /// labels the drill-in in `Klausykite toliau`, `Siūlome` and `Naujausi` alike — same job, and
  /// each is scoped to its own section.
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
    tabLoadTask?.cancel()
    tabLoadTask = nil
    continuePlayingPaintGeneration += 1
    continuePlayingHost = nil
    paintedContinuePlayingIdentity = nil
    paintedContinuePlayingRows = []
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
