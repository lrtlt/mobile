import MediaPlayer

class RDSNowPlayingService {
  static let shared = RDSNowPlayingService()

  private var listener: RDSFirestoreListener?

  private init() {}

  private func firestoreDocPath(for channelId: Int) -> String? {
    switch channelId {
    case 5:
      return "rds/klasika"
    case 6:
      return "rds/opus"
    case 37:
      return "rds/lrt100"
    default:
      return nil
    }
  }

  func startListening(channelId: Int) {
    stopListening()

    guard let docPath = firestoreDocPath(for: channelId) else { return }

    listener = RDSFirestoreListener(documentPath: docPath) { data, error in
      guard let data, error == nil else {
        print("RDSNowPlayingService: error listening to \(docPath): \(error?.localizedDescription ?? "unknown")")
        return
      }

      guard let info = data["info"] as? String else { return }

      let songTitle = info.hasPrefix("Eteryje: ")
        ? String(info.dropFirst("Eteryje: ".count))
        : info

      var nowPlayingInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo ?? [:]
      nowPlayingInfo[MPMediaItemPropertyArtist] = songTitle
      MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
  }

  func stopListening() {
    listener?.remove()
    listener = nil
  }
}
