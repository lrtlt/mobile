import AVFoundation
import CarPlay
import Foundation
import MediaPlayer

class CarPlayUIManager {
  private weak var interfaceController: CPInterfaceController?

  private var nowPlayingTemplate: CPNowPlayingTemplate?
  private var backwardButtonHandler: (() -> Void)?
  private var forwardButtonHandler: (() -> Void)?
  private var playerObserver: NSKeyValueObservation?

  init(interfaceController: CPInterfaceController) {
    self.interfaceController = interfaceController
  }

  func setupInitialUI(delegate: CPTabBarTemplateDelegate, initialTemplate: String?) {
    let recommendedTab = createListTemplate(title: "Siūlome", imageName: "star.fill")
    let liveTab = createListTemplate(title: "Tiesiogiai", imageName: "play.square.fill")
    let newestTab = createListTemplate(title: "Naujausi", imageName: "newspaper.fill")
    let podcastsTab = createListTemplate(title: "Laidos", imageName: "circle.grid.3x3.fill")

    let tabBarTemplate = CPTabBarTemplate(templates: [
      recommendedTab, liveTab, newestTab, podcastsTab,
    ])

    tabBarTemplate.delegate = delegate

    interfaceController?.setRootTemplate(tabBarTemplate, animated: true) { success, error in
      if let initialTemplate = initialTemplate {
        if #available(iOS 17.0, *) {
          if let templateIndex = tabBarTemplate.templates.firstIndex(where: {
            ($0 as? CPListTemplate)?.title == initialTemplate
          }) {
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

  func createListItems(from items: [CarPlayItem], handler: @escaping (CarPlayItem) -> Void) async
    -> [CPListItem]
  {
    var listItems = [CPListItem]()

    // Create list items in order first
    for item in items {
      let listItem = CPListItem(text: item.title, detailText: item.content)
      listItem.accessoryType = .disclosureIndicator
      listItem.handler = { [weak self] _, completion in
        Task { [weak self] in
          guard self != nil else { return }
          handler(item)
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

  func showEpisodesList(
    episodes: [PodcastEpisode], categoryTitle: String,
    onEpisodeSelected: @escaping (CarPlayItem) -> Void
  ) async {
    guard let interfaceController = self.interfaceController else { return }

    let listTemplate = CPListTemplate(title: categoryTitle, sections: [])
    var items = [CPListItem]()

    // Create list items first
    for episode in episodes {
      let item = CPListItem(text: episode.title ?? "", detailText: nil)
      item.handler = { [weak self] _, completion in
        Task { [weak self] in
          guard let self = self else {
            completion()
            return
          }

          // Fetch episode info to get stream URL
          if let episodeId = episode.id {
            do {
              let episodeInfo = try await CarPlayService.shared.fetchEpisodeInfo(
                episodeId: episodeId
              )

              // Convert PodcastEpisode to CarPlayItem with stream URL
              let carPlayItem = CarPlayItem(
                title: episode.title ?? "",
                content: categoryTitle,
                cover: episode.imgPathPrefix != nil && episode.imgPathPostfix != nil
                  ? "https://lrt.lt\(episode.imgPathPrefix!)282x158\(episode.imgPathPostfix!)"
                  : nil,
                streamUrl: episodeInfo.info!.streamUrl,
                isLive: false
              )
              onEpisodeSelected(carPlayItem)
            } catch {
              self.showErrorAlert()
            }
          }

          completion()
        }
      }
      items.append(item)
    }

    // Load images concurrently while preserving order
    await withTaskGroup(of: (Int, UIImage?).self) { group in
      for (index, episode) in episodes.enumerated() {
        guard let prefix = episode.imgPathPrefix, let postfix = episode.imgPathPostfix else {
          continue
        }
        let imageUrl = "https://lrt.lt\(prefix)282x158\(postfix)"
        group.addTask {
          let image = await self.loadImage(from: imageUrl)
          return (index, image)
        }
      }

      for await (index, image) in group {
        if let image = image {
          items[index].setImage(image)
        }
      }
    }

    listTemplate.updateSections([CPListSection(items: items)])
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
      nowPlayingTemplate?.updateNowPlayingButtons([backwardButton, forwardButton])
    }

    if interfaceController?.topTemplate !== nowPlayingTemplate {
      interfaceController?.pushTemplate(nowPlayingTemplate!, animated: true, completion: nil)
    }
  }

  func configureNowPlayingInfo(playlistItem: CarPlayItem, player: AVPlayer) {
    var nowPlayingInfo = [String: Any]()
    nowPlayingInfo[MPMediaItemPropertyTitle] = playlistItem.title

    if playlistItem.isLive != true {
      nowPlayingInfo[MPMediaItemPropertyArtist] = playlistItem.content
    }

    nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = CMTimeGetSeconds(
      player.currentTime())

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
      playerObserver = observer
    }

    // Set initial info
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo

    // Load image asynchronously if available
    if let coverUrl = playlistItem.cover {
      Task {
        if let image = await loadImage(from: coverUrl) {
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

  func setBackwardButtonHandler(_ handler: @escaping () -> Void) {
    backwardButtonHandler = handler
  }

  func setForwardButtonHandler(_ handler: @escaping () -> Void) {
    forwardButtonHandler = handler
  }

  func cleanup() {
    playerObserver?.invalidate()
    playerObserver = nil
  }
}
