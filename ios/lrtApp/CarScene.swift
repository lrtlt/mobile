import AVFoundation
import CarPlay
import Combine
import FirebaseAnalytics
import Foundation
import MediaPlayer
import UIKit

class CarSceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate, CPTabBarTemplateDelegate {
  private var interfaceController: CPInterfaceController?
  private var player: AVPlayer?
  private var currentTemplateTitle: String?
  private var currentPlaylist: [CarPlayItem] = []
  private var currentIndex: Int = 0
  private var uiManager: CarPlayUIManager?

  //Used to track connection time. To avoid duplicated events on simulator
  private var connectionTimestamp: Date?

  private var mediaEndObserver: Any?
  private var playerIntervalObserver: Any?

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didConnect interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller connected")
    Analytics.logEvent("carplay_connected", parameters: nil)
    self.interfaceController = interfaceController
    self.connectionTimestamp = Date()

    uiManager = CarPlayUIManager(interfaceController: interfaceController)
    setupControls()

    // Attempt to resume playback if state exists
    if let playbackState = CarPlayCache.shared.getPlaybackState() {
      uiManager?.setupInitialUI(delegate: self, initialTemplate: playbackState.tab)
      playAudio(from: playbackState.item)
      // Seek to saved position after a short delay to allow player to initialize
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
        self?.seekTo(position: playbackState.position)
      }
    } else {
      uiManager?.setupInitialUI(delegate: self, initialTemplate: nil)
    }
  }

  private func setupControls() {
    RemoteControlManager.shared.setupRemoteCommands(
      playAction: { [weak self] in
        guard let self = self, let player = self.player else { return }
        player.play()
        MPNowPlayingInfoCenter.default().playbackState = .playing
      },
      pauseAction: { [weak self] in
        guard let self = self, let player = self.player else { return }
        player.pause()
        MPNowPlayingInfoCenter.default().playbackState = .paused
      },
      nextTrackAction: { [weak self] in
        self?.playNext()
      },
      previousTrackAction: { [weak self] in
        self?.playPrevious()
      },
      changePlaybackPositionAction: { [weak self] position in
        self?.seekTo(position: position)
      }
    )

    uiManager?.setBackwardButtonHandler { [weak self] in
      self?.seekBackward()
    }
    uiManager?.setForwardButtonHandler { [weak self] in
      self?.seekForward()
    }
  }

  private func loadPodcasts(for listTemplate: CPListTemplate) async {
    do {
      let categories = try await CarPlayService.shared.fetchPodcasts()

      // Group categories by first letter
      let groupedCategories = Dictionary(grouping: categories) { category in
        String((category.title ?? "").trimmingCharacters(in: .punctuationCharacters).first ?? "#")
          .uppercased()
      }

      // Sort sections alphabetically
      let sortedSections = groupedCategories.keys.sorted().map { letter in
        let items = (groupedCategories[letter] ?? []).map { category in
          let item = CPListItem(text: category.title ?? "", detailText: nil)
          item.handler = { [weak self] _, completion in
            guard let self = self, let categoryId = category.id else {
              completion()
              return
            }

            Task {
              do {
                let episodes = try await CarPlayService.shared.fetchEpisodes(categoryId: categoryId)
                await self.uiManager?.showEpisodesList(
                  episodes: episodes, categoryTitle: category.title ?? "") { episode in
                    self.playAudio(from: episode)
                  }
              } catch {
                print("Failed to fetch episodes: \(error.localizedDescription)")
              }
              completion()
            }
          }
          return item
        }
        return CPListSection(items: items, header: letter, sectionIndexTitle: letter)
      }
      listTemplate.updateSections(sortedSections)
    } catch {
      print("Failed to load podcasts: \(error.localizedDescription)")
    }
  }

  func tabBarTemplate(_ tabBarTemplate: CPTabBarTemplate, didSelect selectedTemplate: CPTemplate) {
    if let listTemplate = selectedTemplate as? CPListTemplate {
      print("Selected tab: \(listTemplate.title ?? "Untitled")")

      if listTemplate.title == "Laidos" {
        Task {
          await loadPodcasts(for: listTemplate)
        }
        return
      }

      Task {
        do {
          let listItems: [CPListItem]
          listItems = try await loadItems(for: listTemplate.title ?? "")
          listTemplate.updateSections([CPListSection(items: listItems)])
        } catch {
          let item = CPListItem(
            text: "Įvyko klaida! Patikrinkite interneto ryšį",
            detailText: "Paspauskite noredami pabandyti dar kartą"
          )
          item.handler = { [weak self] _, completion in
            Task { [weak self] in
              guard self != nil else { return }
              self!.tabBarTemplate(tabBarTemplate, didSelect: listTemplate)
              completion()
            }
          }

          listTemplate.updateSections([
            CPListSection(items: [item])
          ])
        }
      }
    }
  }

  private func loadItems(for tab: String) async throws -> [CPListItem] {
    self.currentTemplateTitle = tab
    switch tab {
    case "Siūlome":
      return try await updateCurrentIndexAndPlaylist(with: CarPlayService.shared.fetchRecommended())
    case "Naujausi":
      return try await updateCurrentIndexAndPlaylist(with: CarPlayService.shared.fetchNewest())
    case "Tiesiogiai":
      return try await updateCurrentIndexAndPlaylist(with: CarPlayService.shared.fetchLive())
    default:
      return []
    }
  }

  private func updateCurrentIndexAndPlaylist(with items: [CarPlayItem]) async -> [CPListItem] {
    currentPlaylist = items

    if let currentItem = player?.currentItem,
      let currentUrl = (currentItem.asset as? AVURLAsset)?.url.absoluteString,
      let index = items.firstIndex(where: { $0.streamUrl == currentUrl })
    {
      currentIndex = index
    }

    return await uiManager!.createListItems(from: items) { [weak self] selectedItem in
      guard let self = self else { return }

      if let index = items.firstIndex(where: { $0.streamUrl == selectedItem.streamUrl }) {
        self.currentIndex = index
      }
      self.playAudio(from: selectedItem)
    }
  }

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didDisconnectInterfaceController interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller disconnected")
    Analytics.logEvent("carplay_disconnected", parameters: nil)

    if let connectionTimestamp = connectionTimestamp,
      Date().timeIntervalSince(connectionTimestamp) > 2
    {
      if let player = player,
        player.rate > 0,  // Only save if actually playing
        currentPlaylist.count > 0,
        currentIndex < currentPlaylist.count
      {
        print("Saving playback state")
        let position = CMTimeGetSeconds(player.currentTime())
        CarPlayCache.shared.savePlaybackState(
          item: currentPlaylist[currentIndex], position: position, tab: currentTemplateTitle
        )
      } else {
        print("Clearing playback state cache")
        CarPlayCache.shared.clearPlaybackState()
      }
    } else {
      print("Not connected for more than 2 seconds")
    }

    self.interfaceController = nil
    self.player?.pause()
    //    self.player = nil
    MPNowPlayingInfoCenter.default().playbackState = .stopped
    //    removeObservers()
    //    RemoteControlManager.shared.removeHandlers()
    uiManager?.cleanup()
  }

  private func playAudio(from selectedItem: CarPlayItem) {
    guard let urlString = selectedItem.streamUrl, let url = URL(string: urlString) else {
      print("Invalid stream URL")
      return
    }

    if let currentItem = player?.currentItem,
      let currentUrl = (currentItem.asset as? AVURLAsset)?.url,
      currentUrl == url
    {
      //Just open NowPlayingTemplate becuase the stream is already playing
      uiManager?.showNowPlayingTemplate(isLive: selectedItem.isLive == true)
      return
    }

    player?.pause()
    removeObservers()

    // Configure audio session
    let audioSession = AVAudioSession.sharedInstance()
    do {
      try audioSession.setCategory(.playback, mode: .spokenAudio, policy: .longFormAudio)
      try audioSession.setActive(true)
    } catch {
      print("Failed to configure audio session: \(error.localizedDescription)")
    }

    // Create new player
    player = AVPlayer(url: url)
    player?.play()

    MPNowPlayingInfoCenter.default().playbackState = .playing

    addPlayerObservers()
    uiManager?.configureNowPlayingInfo(playlistItem: selectedItem, player: player!)
    uiManager?.showNowPlayingTemplate(isLive: selectedItem.isLive == true)
  }

  private func addPlayerObservers() {
    guard let player = player else { return }

    // Add player selectedItem observer
    mediaEndObserver = NotificationCenter.default.addObserver(
      forName: .AVPlayerItemDidPlayToEndTime,
      object: player.currentItem,
      queue: .main
    ) { _ in
      MPNowPlayingInfoCenter.default().playbackState = .stopped
      self.playNext()
    }

    // Add periodic time observer
    let interval = CMTime(seconds: 1, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    playerIntervalObserver = player.addPeriodicTimeObserver(forInterval: interval, queue: .main) {
      [weak self] _ in
      self?.updateNowPlayingTime()
    }
  }

  private func seekForward() {
    guard let player = player else { return }
    let currentTime = player.currentTime()
    let seekTime = CMTimeAdd(currentTime, CMTimeMake(value: 15, timescale: 1))
    player.seek(to: seekTime)
    updateNowPlayingTime()
  }

  private func seekBackward() {
    guard let player = player else { return }
    let currentTime = player.currentTime()
    let seekTime = CMTimeSubtract(currentTime, CMTimeMake(value: 15, timescale: 1))
    player.seek(to: seekTime)
    updateNowPlayingTime()
  }

  private func seekTo(position: TimeInterval) {
    guard let player = player else { return }
    let seekTime = CMTime(seconds: position, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    player.seek(to: seekTime)
    updateNowPlayingTime()
  }

  private func updateNowPlayingTime() {
    guard let player = player else { return }
    var nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]
    nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = CMTimeGetSeconds(
      player.currentTime())
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
  }

  private func removeObservers() {
    if let observer = mediaEndObserver {
      NotificationCenter.default.removeObserver(observer)
      mediaEndObserver = nil
    }

    if let observer = playerIntervalObserver, let player = player {
      player.removeTimeObserver(observer)
      playerIntervalObserver = nil
    }
  }

  private func playNext() {
    guard !currentPlaylist.isEmpty else { return }
    currentIndex = (currentIndex + 1) % currentPlaylist.count
    playAudio(from: currentPlaylist[currentIndex])
  }

  private func playPrevious() {
    guard !currentPlaylist.isEmpty else { return }
    currentIndex = (currentIndex - 1 + currentPlaylist.count) % currentPlaylist.count
    playAudio(from: currentPlaylist[currentIndex])
  }
}
