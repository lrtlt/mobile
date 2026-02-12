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

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didConnect interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller connected")
    Analytics.logEvent("carplay_connected", parameters: nil)
    self.interfaceController = interfaceController
    self.connectedAt = Date()

    uiManager = CarPlayUIManager(interfaceController: interfaceController)
    uiManager?.setupInitialUI(
      delegate: self, initialTemplate: cache.getCurrentTemplateTitle())

    // Attempt to resume playback if state exists
    if cache.getShouldResumePlayer(),
      player.isReadyToPlay
    {
      player.play()
      setupControls()
      uiManager?.showNowPlayingTemplate(isLive: playlist.current?.isLive ?? false)
    }
  }

  private func setupControls() {
    RemoteControlManager.shared.setupRemoteCommands(
      playAction: { [weak self] in
        self?.player.play()
      },
      pauseAction: { [weak self] in
        self?.player.pause()
      },
      nextTrackAction: { [weak self] in
        do {
          try self?.player.playNext()
        } catch {
          print("Error playing next track: \(error.localizedDescription)")
        }
      },
      previousTrackAction: { [weak self] in
        do {
          try self?.player.playPrevious()
        } catch {
          print("Error playing previous track: \(error.localizedDescription)")
        }
      },
      changePlaybackPositionAction: { [weak self] position in
        self?.player.seekTo(position: position)
      }
    )

    uiManager?.setBackwardButtonHandler { [weak self] in
      self?.player.seekBackward()
    }
    uiManager?.setForwardButtonHandler { [weak self] in
      self?.player.seekForward()
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
                  episodes: episodes, categoryTitle: category.title ?? ""
                ) { episode in
                  //TODO: improve maybe later
                  self.playlist.currentPlaylist = [episode]
                  self.playlist.currentIndex = 0
                  self.onPlayableItemSelected(from: episode)
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
      print("Selected tab: \(listTemplate.title ?? "?")")
      Analytics.logEvent("carplay_tab_open_\(listTemplate.title ?? "?")", parameters: nil)
      cache.setCurrentTemplateTitle(listTemplate.title)

      if listTemplate.title == "Laidos" {
        Task {
          await loadPodcasts(for: listTemplate)
        }
        return
      }

      Task {
        do {
          var listItems: [CPListItem]
          listItems = try await loadItems(for: listTemplate.title ?? "")

          if listTemplate.title == "Naujausi" {
            let refreshItem = CPListItem(text: "Atnaujinti", detailText: nil)
            refreshItem.handler = { [weak self] _, completion in
              self?.tabBarTemplate(tabBarTemplate, didSelect: listTemplate)
              completion()
            }
            listItems.insert(refreshItem, at: 0)
          }

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
    playlist.currentPlaylist = items

    if let currentUrl = player.currentUrl?.absoluteString,
      let index = items.firstIndex(where: { $0.streamUrl == currentUrl })
    {
      playlist.currentIndex = index
    }

    return await uiManager!.createListItems(from: items) { [weak self] selectedItem in
      guard let self = self else { return }
      if let index = items.firstIndex(where: { $0.streamUrl == selectedItem.streamUrl }) {
        playlist.currentIndex = index
      }
      self.onPlayableItemSelected(from: selectedItem)
    }
  }

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didDisconnectInterfaceController interfaceController: CPInterfaceController
  ) {
    print("CarPlay interface controller disconnected")
    Analytics.logEvent("carplay_disconnected", parameters: nil)
    saveState()
    player.pause()
    RDSNowPlayingService.shared.stopListening()
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
      setupControls()
      uiManager?.showNowPlayingTemplate(isLive: selectedItem.isLive == true)
    } catch {
      print("Error loading stream: \(error.localizedDescription)")
      uiManager?.showErrorAlert()
    }
  }
}
