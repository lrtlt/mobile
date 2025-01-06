import AVFoundation
import CarPlay
import Combine
import FirebaseAnalytics
import Foundation
import MediaPlayer
import UIKit

class CarSceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate, CPTabBarTemplateDelegate {
  var interfaceController: CPInterfaceController?

  private var player: AVPlayer?
  private var nowPlayingTemplate: CPNowPlayingTemplate?
  private var currentPlaylist: [CarPlayItem] = []
  private var currentIndex: Int = 0
  private var playerObserver: Any?

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didConnect interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller connected")
    Analytics.logEvent("carplay_connected", parameters: nil)
    self.interfaceController = interfaceController
    setupRemoteControlCenter()

    // Create tab templates with icons
    let recommendedTab = createListTemplate(
      title: "Siūlome", imageName: "star.fill", loadInitialData: false)
    let liveTab = createListTemplate(
      title: "Tiesiogiai", imageName: "play.square.fill", loadInitialData: false)
    let latestTab = createListTemplate(
      title: "Naujausi", imageName: "newspaper.fill", loadInitialData: false)
    let showsTab = createListTemplate(
      title: "Laidos", imageName: "circle.grid.3x3.fill", loadInitialData: false)

    // Create tab bar template with delegate
    let tabBarTemplate = CPTabBarTemplate(templates: [recommendedTab, liveTab, latestTab, showsTab])
    tabBarTemplate.delegate = self

    interfaceController.setRootTemplate(tabBarTemplate, animated: true, completion: nil)
  }

  func tabBarTemplate(_ tabBarTemplate: CPTabBarTemplate, didSelect selectedTemplate: CPTemplate) {
    if let listTemplate = selectedTemplate as? CPListTemplate {
      print("Selected tab: \(listTemplate.title ?? "Untitled")")
      loadTemplateData(for: listTemplate, title: listTemplate.title ?? "")
    }
  }

  private func createListTemplate(title: String, imageName: String, loadInitialData: Bool)
    -> CPListTemplate
  {
    // Create tab image
    let image = UIImage(systemName: imageName)

    // Create empty list template
    let listTemplate = CPListTemplate(title: title, sections: [])
    listTemplate.tabImage = image

    // Load initial data
    if loadInitialData {
      loadTemplateData(for: listTemplate, title: title)
    }

    return listTemplate
  }

  private func loadTemplateData(for template: CPListTemplate, title: String) {
    print("Loading data for template: \(title)")
    Task {
      do {
        let items = try await loadItems(for: title)
        let section = CPListSection(items: items)
        template.updateSections([section])
      } catch {
        print("Failed to load items: \(error.localizedDescription)")
        // Fallback to empty state
        let section = CPListSection(items: [
          CPListItem(text: "Nepavyko įkelti duomenų", detailText: "Bandykite vėliau")
        ])
        template.updateSections([section])
      }
    }
  }

  private func createListItems(from items: [CarPlayItem]) async -> [CPListItem] {
    var listItems = [CPListItem]()

    // Create list items in order first
    for item in items {
      let listItem = CPListItem(text: item.title, detailText: item.content)
      listItem.accessoryType = .disclosureIndicator
      listItem.handler = { [weak self] _, completion in
        Task { @MainActor [weak self] in
          guard let self = self else { return }
          // Update playlist with current tab's items
          self.currentPlaylist = items

          // Find index of selected item
          if let index = items.firstIndex(where: { $0.streamUrl == item.streamUrl }) {
            self.currentIndex = index
          } else {
            self.currentIndex = 0
          }
          self.playAudio(from: item)
          completion()
        }
      }
      listItems.append(listItem)
    }

    // Load images concurrently while preserving order
    await withTaskGroup(of: (Int, UIImage?).self) { group in
      for (index, item) in items.enumerated() {
        if let coverUrl = item.cover {
          group.addTask {
            let image = await self.loadImage(from: coverUrl)
            return (index, image)
          }
        }
      }

      for await (index, image) in group {
        if let image = image {
          listItems[index].setImage(image)
        }
      }
    }

    return listItems
  }

  private func loadItems(for tab: String) async throws -> [CPListItem] {
    switch tab {
    case "Siūlome":
      let items = try await CarPlayService.shared.fetchRecommended()
      return await createListItems(from: items)
    case "Naujausi":
      let items = try await CarPlayService.shared.fetchNewest()
      return await createListItems(from: items)
    case "Tiesiogiai":
      let items = try await CarPlayService.shared.fetchLive()
      return await createListItems(from: items)
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
    removePlayerObservers()
    MPNowPlayingInfoCenter.default().playbackState = .stopped

    // Clean up remote command center
    let commandCenter = MPRemoteCommandCenter.shared()
    commandCenter.playCommand.removeTarget(nil)
    commandCenter.pauseCommand.removeTarget(nil)
    commandCenter.togglePlayPauseCommand.removeTarget(nil)
    commandCenter.stopCommand.removeTarget(nil)
    commandCenter.nextTrackCommand.removeTarget(nil)
    commandCenter.previousTrackCommand.removeTarget(nil)
    commandCenter.skipForwardCommand.removeTarget(nil)
    commandCenter.skipBackwardCommand.removeTarget(nil)
    commandCenter.changePlaybackPositionCommand.removeTarget(nil)

    MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
  }

  @MainActor
  private func playAudio(from item: CarPlayItem) {
    guard let urlString = item.streamUrl, let url = URL(string: urlString) else {
      print("Invalid stream URL")
      return
    }

    if player != nil {
      removePlayerObservers()
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

    // Remove observers from previous player if exists

    // Create new player
    player = AVPlayer(url: url)
    player?.play()
    MPNowPlayingInfoCenter.default().playbackState = .playing
    addPlayerObservers()

    // Configure Now Playing Info
    configureNowPlayingInfo()

    // Create NowPlaying template if not already created
    if nowPlayingTemplate == nil {
      nowPlayingTemplate = CPNowPlayingTemplate.shared
      nowPlayingTemplate?.isUpNextButtonEnabled = false
      nowPlayingTemplate?.isAlbumArtistButtonEnabled = false
    }

    if item.isLive == true {
      nowPlayingTemplate?.updateNowPlayingButtons([])
    } else {
      let backwardButton = CPNowPlayingImageButton(image: UIImage(systemName: "gobackward.15")!) {
        [weak self] _ in
        self?.seekBackward()
      }
      let forwardButton = CPNowPlayingImageButton(image: UIImage(systemName: "goforward.15")!) {
        [weak self] _ in
        self?.seekForward()
      }
      nowPlayingTemplate?.updateNowPlayingButtons([backwardButton, forwardButton])
    }

    // Only push template if it's not already visible
    if interfaceController?.topTemplate !== nowPlayingTemplate {
      interfaceController?.pushTemplate(nowPlayingTemplate!, animated: true, completion: nil)
    }
  }

  private func addPlayerObservers() {
    guard let player = player else { return }

    // Add player item observer
    playerObserver = NotificationCenter.default.addObserver(
      forName: .AVPlayerItemDidPlayToEndTime,
      object: player.currentItem,
      queue: .main
    ) { _ in
      MPNowPlayingInfoCenter.default().playbackState = .stopped
    }

    // Add periodic time observer
    let interval = CMTime(seconds: 1, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    playerObserver = player.addPeriodicTimeObserver(forInterval: interval, queue: .main) {
      [weak self] _ in
      self?.updateNowPlayingTime()
    }
  }

  private func setupRemoteControlCenter() {
    let commandCenter = MPRemoteCommandCenter.shared()

    commandCenter.togglePlayPauseCommand.isEnabled = true
    commandCenter.playCommand.addTarget { event in
      guard let player = self.player else { return MPRemoteCommandHandlerStatus.commandFailed }
      player.play()
      MPNowPlayingInfoCenter.default().playbackState = .playing
      return MPRemoteCommandHandlerStatus.success
    }

    commandCenter.pauseCommand.addTarget { event in
      guard let player = self.player else { return MPRemoteCommandHandlerStatus.commandFailed }
      player.pause()
      MPNowPlayingInfoCenter.default().playbackState = .paused
      return MPRemoteCommandHandlerStatus.success
    }

    commandCenter.nextTrackCommand.isEnabled = true
    commandCenter.nextTrackCommand.addTarget { event in
      self.playNext()
      return MPRemoteCommandHandlerStatus.success
    }

    commandCenter.previousTrackCommand.isEnabled = true
    commandCenter.previousTrackCommand.addTarget { event in
      self.playPrevious()
      return MPRemoteCommandHandlerStatus.success
    }

    //We disable this command because it overrides nextTrackCommand
    commandCenter.skipForwardCommand.isEnabled = false
    commandCenter.skipForwardCommand.preferredIntervals = [15]
    commandCenter.skipForwardCommand.addTarget { event in
      self.seekForward()
      return .success
    }

    //We disable this command because it overrides previousTrackCommand
    commandCenter.skipBackwardCommand.isEnabled = false
    commandCenter.skipBackwardCommand.preferredIntervals = [15]
    commandCenter.skipBackwardCommand.addTarget { event in
      self.seekBackward()
      return .success
    }

    commandCenter.changePlaybackPositionCommand.isEnabled = true
    commandCenter.changePlaybackPositionCommand.addTarget { [weak self] event in
      guard let self = self,
        let positionEvent = event as? MPChangePlaybackPositionCommandEvent
      else {
        return .commandFailed
      }
      self.seekTo(position: positionEvent.positionTime)
      return .success
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

  //TODO: probably remove this function later
  private func removePlayerObservers() {
    if let observer = playerObserver {
      NotificationCenter.default.removeObserver(observer)
      playerObserver = nil
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
    let playlistItem = currentPlaylist[currentIndex]

    var nowPlayingInfo = [String: Any]()
    nowPlayingInfo[MPMediaItemPropertyTitle] = playlistItem.title
    nowPlayingInfo[MPMediaItemPropertyArtist] = playlistItem.content

    // Set initial progress
    if let player = player {
      nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = CMTimeGetSeconds(
        player.currentTime())
    }

    // Set duration when player item becomes ready
    if let player = player, let currentItem = player.currentItem {
      let observer = currentItem.observe(\.status, options: [.new]) { item, _ in
        guard item.status == .readyToPlay else { return }

        if playlistItem.isLive == true {
          var nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]
          nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = true
          MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
        } else {
          let duration = CMTimeGetSeconds(item.duration)
          if duration.isFinite && !duration.isNaN {
            var nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]
            nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = false
            nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
          }
        }
      }
      // Store observer for cleanup
      playerObserver = observer
    }

    // Load image asynchronously if available
    if let coverUrl = playlistItem.cover {
      Task {
        if let image = await loadImage(from: coverUrl) {
          nowPlayingInfo[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(boundsSize: image.size) {
            _ in
            return image
          }
          MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
        }
      }
    } else {
      MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
  }

  private func loadImage(from urlString: String) async -> UIImage? {
    guard let url = URL(string: urlString) else { return nil }

    do {
      let (data, _) = try await URLSession.shared.data(from: url)
      return UIImage(data: data)
    } catch {
      print("Failed to load image: \(error.localizedDescription)")
      return nil
    }
  }

  // MARK: - CPListTemplateDelegate
  func templateDidAppear(_ template: CPListTemplate, animated: Bool) {
    // Reload template data when it appears
    guard let title = template.title else { return }
    loadTemplateData(for: template, title: title)
  }
}
