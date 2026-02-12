import Foundation
import SwiftUI
import UIKit

class PhoneSceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene, willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    if session.role != .windowApplication {
      return
    }

    guard let appDelegate = (UIApplication.shared.delegate as? AppDelegate) else { return }
    guard let windowScene = (scene as? UIWindowScene) else { return }

    window = UIWindow(windowScene: windowScene)
    appDelegate.initAppFromScene(connectionOptions: connectionOptions, window: window!)
  }

  //Called when deep link is opened from push notifications
  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    URLContexts.forEach({ context in
      RCTLinkingManager.application(UIApplication.shared, open: context.url)
    })
  }
  
  //Called when universal link is opened from browser
  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    RCTLinkingManager.application(UIApplication.shared, continue: userActivity) { _ in
      // Handle any additional restoration logic if needed
    }
  }

  //This is probably not called but just left here just in case
  func scene(
    _ scene: UIScene,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    return RCTLinkingManager.application(
      UIApplication.shared,
      continue: userActivity,
      restorationHandler: restorationHandler)
  }
  
}
