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
  private var currentPlaylist: [CarPlayItem] = []
  private var currentIndex: Int = 0
  private var uiManager: CarPlayUIManager?

  private var mediaEndObserver: Any?
  private var playerIntervalObserver: Any?

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didConnect interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller connected")
    Analytics.logEvent("carplay_connected", parameters: nil)
    self.interfaceController = interfaceController

    uiManager = CarPlayUIManager(
      interfaceController: interfaceController, tabBarTemplateDelegate: self)
    uiManager?.setupInitialUI()
    setupControls()
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

  func tabBarTemplate(_ tabBarTemplate: CPTabBarTemplate, didSelect selectedTemplate: CPTemplate) {
    if let listTemplate = selectedTemplate as? CPListTemplate {
      print("Selected tab: \(listTemplate.title ?? "Untitled")")
      Task {
        do {
          let listItems: [CPListItem]
          listItems = try await loadItems(for: listTemplate.title ?? "")
          listTemplate.updateSections([CPListSection(items: listItems)])
        } catch {
          listTemplate.updateSections([
            CPListSection(items: [
              CPListItem(
                text: "Nepavyko užkrauti duomenų",
                detailText: "Patikrinkite interneto ryšį"
              )
            ])
          ])
        }
      }
    }
  }

  private func loadItems(for tab: String) async throws -> [CPListItem] {
    switch tab {
    case "Siūlome":
      let items = try await CarPlayService.shared.fetchRecommended()
      currentPlaylist = items
      return await uiManager!.createListItems(from: items) { [weak self] item in
        Task { [weak self] in
          guard let self = self else { return }

          // Find index of selected item
          if let index = items.firstIndex(where: { $0.streamUrl == item.streamUrl }) {
            self.currentIndex = index
          } else {
            self.currentIndex = 0
          }
          self.playAudio(from: item)

        }
      }
    case "Naujausi":
      let items = try await CarPlayService.shared.fetchNewest()
      currentPlaylist = items
      return await uiManager!.createListItems(from: items) { [weak self] item in
        Task { @MainActor [weak self] in
          guard let self = self else { return }

          // Find index of selected item
          if let index = items.firstIndex(where: { $0.streamUrl == item.streamUrl }) {
            self.currentIndex = index
          } else {
            self.currentIndex = 0
          }
          self.playAudio(from: item)

        }
      }

    case "Tiesiogiai":
      let items = try await CarPlayService.shared.fetchLive()
      currentPlaylist = items
      return await uiManager!.createListItems(from: items) { [weak self] item in
        Task { @MainActor [weak self] in
          guard let self = self else { return }

          // Find index of selected item
          if let index = items.firstIndex(where: { $0.streamUrl == item.streamUrl }) {
            self.currentIndex = index
          } else {
            self.currentIndex = 0
          }
          self.playAudio(from: item)

        }
      }
    default:
      return []
    }
  }

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didDisconnectInterfaceController interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller disconnected")
    Analytics.logEvent("carplay_disconnected", parameters: nil)
    self.interfaceController = nil
    self.player?.pause()
    self.player = nil
    MPNowPlayingInfoCenter.default().playbackState = .stopped
    removeObservers()
    RemoteControlManager.shared.removeHandlers()
    uiManager?.cleanup()
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
  }

  private func playAudio(from item: CarPlayItem) {
    guard let urlString = item.streamUrl, let url = URL(string: urlString) else {
      print("Invalid stream URL")
      return
    }

    if player != nil {
      removeObservers()
    }

    // Stop current playback
    player?.pause()

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
    configureNowPlayingInfo()
    uiManager?.showNowPlayingTemplate(isLive: item.isLive == true)
  }

  private func addPlayerObservers() {
    guard let player = player else { return }

    // Add player item observer
    mediaEndObserver = NotificationCenter.default.addObserver(
      forName: .AVPlayerItemDidPlayToEndTime,
      object: player.currentItem,
      queue: .main
    ) { _ in
      MPNowPlayingInfoCenter.default().playbackState = .stopped
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

  private func configureNowPlayingInfo() {
    guard currentIndex >= 0 && currentIndex < currentPlaylist.count else { return }
    guard let player = player else { return }
    uiManager?.configureNowPlayingInfo(playlistItem: currentPlaylist[currentIndex], player: player)
  }
}
