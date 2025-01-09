import MediaPlayer

class RemoteControlManager {
  static let shared = RemoteControlManager()

  private let commandCenter = MPRemoteCommandCenter.shared()
  private var playHandler: Any?
  private var pauseHandler: Any?
  private var nextTrackHandler: Any?
  private var previousTrackHandler: Any?
  private var changePlaybackPositionHandler: Any?

  private init() {}

  func setupRemoteCommands(
    playAction: @escaping () -> Void,
    pauseAction: @escaping () -> Void,
    nextTrackAction: @escaping () -> Void,
    previousTrackAction: @escaping () -> Void,
    changePlaybackPositionAction: @escaping (TimeInterval) -> Void
  ) {
    // Remove existing handlers if any
    clearRemoteControls()

    
    commandCenter.togglePlayPauseCommand.isEnabled = true
    playHandler = commandCenter.playCommand.addTarget { e in
      playAction()
      return .success
    }

    pauseHandler = commandCenter.pauseCommand.addTarget { _ in
      pauseAction()
      return .success
    }

    commandCenter.nextTrackCommand.isEnabled = true
    nextTrackHandler = commandCenter.nextTrackCommand.addTarget { _ in
      nextTrackAction()
      return .success
    }

    commandCenter.previousTrackCommand.isEnabled = true
    previousTrackHandler = commandCenter.previousTrackCommand.addTarget { e in
      previousTrackAction()
      return .success
    }

    commandCenter.changePlaybackPositionCommand.isEnabled = true
    changePlaybackPositionHandler = commandCenter.changePlaybackPositionCommand.addTarget { event in
      if let positionEvent = event as? MPChangePlaybackPositionCommandEvent {
        changePlaybackPositionAction(positionEvent.positionTime)
      }
      return .success
    }

    commandCenter.skipForwardCommand.isEnabled = false
    commandCenter.skipBackwardCommand.isEnabled = false
  }

  func clearRemoteControls() {
    if let handler = playHandler {
      commandCenter.playCommand.removeTarget(handler)
    }
    if let handler = pauseHandler {
      commandCenter.pauseCommand.removeTarget(handler)
    }
    if let handler = nextTrackHandler {
      commandCenter.nextTrackCommand.removeTarget(handler)
    }
    if let handler = previousTrackHandler {
      commandCenter.previousTrackCommand.removeTarget(handler)
    }
    if let handler = changePlaybackPositionHandler {
      commandCenter.changePlaybackPositionCommand.removeTarget(handler)
    }
  }
}
