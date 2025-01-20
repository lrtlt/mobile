import AVFoundation
import FirebaseAnalytics
import MediaPlayer

class PlayerController {
  static let shared = PlayerController()

  private var player: AVPlayer?

  private let playlist = Playlist.shared

  private var mediaEndObserver: Any?
  private var playerIntervalObserver: Any?
  private var readyToPlayObserver: NSKeyValueObservation?
  private var interruptionObserver: Any?

  var currentTime: CMTime {
    return player?.currentTime() ?? .zero
  }

  var isPlaying: Bool {
    return player?.rate != 0
  }

  var isReadyToPlay: Bool {
    return player?.status == .readyToPlay
  }

  var currentUrl: URL? {
    return (player?.currentItem?.asset as? AVURLAsset)?.url
  }

  func setupStream(for item: CarPlayItem) throws {
    player?.pause()
    removeObservers()

    guard let streamUrl = item.streamUrl, let url = URL(string: streamUrl) else {
      print("Invalid stream URL \(String(describing: item.streamUrl))")
      MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
      throw NSError(
        domain: "PlayerError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid stream URL"])
    }

    let audioSession = AVAudioSession.sharedInstance()
    do {
      try audioSession.setCategory(.playback, mode: .spokenAudio, policy: .longFormAudio)
      try audioSession.setActive(true)
    } catch {
      print("Failed to configure audio session: \(error.localizedDescription)")
    }

    if let currentUrl = self.currentUrl, currentUrl == url {
      //It's the same stream do not recreate player
      play()
    } else {
      player = AVPlayer(url: url)
      play()
    }

    addPlayerObservers()
    syncNowPlayingInfo(playlistItem: item)
  }

  func play() {
    player?.play()
    MPNowPlayingInfoCenter.default().playbackState = .playing
  }

  func pause() {
    player?.pause()
    MPNowPlayingInfoCenter.default().playbackState = .paused
  }

  func seekForward() {
    guard let player = player else { return }
    let seekTime = CMTimeAdd(currentTime, CMTimeMake(value: 15, timescale: 1))
    player.seek(to: seekTime)
    updateNowPlayingTime()
  }

  func seekBackward() {
    guard let player = player else { return }
    let seekTime = CMTimeSubtract(currentTime, CMTimeMake(value: 15, timescale: 1))
    player.seek(to: seekTime)
    updateNowPlayingTime()
  }

  func seekTo(position: TimeInterval) {
    guard let player = player else { return }
    let seekTime = CMTime(seconds: position, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    player.seek(to: seekTime)
    updateNowPlayingTime()
  }

  func playNext() throws {
    guard let nextItem = playlist.next() else { return }
    guard playlist.currentPlaylist.count > 1 else { return }
    try setupStream(for: nextItem)
  }

  func playPrevious() throws {
    guard let previousItem = playlist.previous() else { return }
    guard playlist.currentPlaylist.count > 1 else { return }
    try setupStream(for: previousItem)
  }

  private func addPlayerObservers() {
    guard let player = player else { return }
    mediaEndObserver = NotificationCenter.default.addObserver(
      forName: .AVPlayerItemDidPlayToEndTime,
      object: player.currentItem,
      queue: .main
    ) { [weak self] _ in
      self?.onPlayerEnded()
    }

    let interval = CMTime(seconds: 1, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    playerIntervalObserver = player.addPeriodicTimeObserver(forInterval: interval, queue: .main) {
      [weak self] _ in
      self?.updateNowPlayingTime()
    }

    interruptionObserver = NotificationCenter.default.addObserver(
      forName: AVAudioSession.interruptionNotification,
      object: nil,
      queue: .main
    ) { [weak self] notification in
      guard let self = self else { return }

      guard let userInfo = notification.userInfo,
        let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
        let type = AVAudioSession.InterruptionType(rawValue: typeValue)
      else {
        print("Interruption: Invalid notification")
        Analytics.logEvent("carplay_interruption_no_user_info", parameters: nil)
        return
      }

      switch type {
      case .began:
        Analytics.logEvent("carplay_interruption_began", parameters: nil)
        print("Interruption: began")
        // Pause playback when interruption begins
        self.pause()
      case .ended:
        Analytics.logEvent("carplay_interruption_ended", parameters: nil)
        print("Interruption: ended")
        // Resume playback when interruption ends, if appropriate
        if let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt {
          let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
          if options.contains(.shouldResume) {
            Analytics.logEvent("carplay_interruption_resuming", parameters: nil)
            print("Interruption: Resuming playback")
            self.play()
          }
        }
      @unknown default:
        break
      }
    }
  }

  private func onPlayerEnded() {
    MPNowPlayingInfoCenter.default().playbackState = .stopped
    do {
      try playNext()
    } catch {}
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

    if let observer = interruptionObserver {
      NotificationCenter.default.removeObserver(observer)
      interruptionObserver = nil
    }
  }

  private func updateNowPlayingTime() {
    guard let player = player else { return }
    var nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]

    nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = CMTimeGetSeconds(
      player.currentTime())
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
  }

  func syncNowPlayingInfo(playlistItem: CarPlayItem) {
    guard let player = player else { return }

    var nowPlayingInfo = [String: Any]()
    nowPlayingInfo[MPMediaItemPropertyTitle] = playlistItem.title

    if playlistItem.isLive != true {
      nowPlayingInfo[MPMediaItemPropertyArtist] = playlistItem.content
    }

    nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = CMTimeGetSeconds(
      player.currentTime()
    )

    // Set duration when player item becomes ready
    if let currentItem = player.currentItem {
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
      readyToPlayObserver = observer
    }

    // Set initial info
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo

    // Load image asynchronously if available
    if let coverUrl = playlistItem.cover {
      Task {
        if let image = await CarPlayUIManager.loadImage(from: coverUrl) {
          var nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]
          nowPlayingInfo[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(boundsSize: image.size) {
            _ in
            return image
          }
          MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
        }
      }
    }
  }
}
