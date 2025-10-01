import CarPlay
import Firebase
import GoogleCast
import RNFBAppCheck
import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  static var shared: AppDelegate { return UIApplication.shared.delegate as! AppDelegate }

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    RNFBAppCheckModule.sharedInstance()
    FirebaseApp.configure()

    // let kReceiverAppID = kGCKDefaultMediaReceiverApplicationID
    let kReceiverAppID = "87169DE4"
    let criteria = GCKDiscoveryCriteria(applicationID: kReceiverAppID)
    let options = GCKCastOptions(discoveryCriteria: criteria)
    GCKCastContext.setSharedInstanceWith(options)

    return true
  }

  func initAppFromScene(connectionOptions: UIScene.ConnectionOptions?, window: UIWindow) {
    if self.reactNativeDelegate != nil {
      return
    }

    //Prepare launchOptions if application launched from Universal Link
    var launchOptions: [AnyHashable: Any] = [:]
    let launchUrl = connectionOptions?.userActivities.first?.webpageURL
    if launchUrl != nil {
      launchOptions = [UIApplication.LaunchOptionsKey.url: launchUrl ?? ""]
    }

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    factory.startReactNative(
      withModuleName: "lrtApp",
      in: window,
      launchOptions: launchOptions
    )
  }

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    if connectingSceneSession.role == UISceneSession.Role.carTemplateApplication {
      let scene = UISceneConfiguration(name: "CarPlay", sessionRole: connectingSceneSession.role)
      scene.delegateClass = CarSceneDelegate.self
      return scene
    } else {
      let scene = UISceneConfiguration(name: "Phone", sessionRole: connectingSceneSession.role)
      scene.delegateClass = PhoneSceneDelegate.self
      return scene
    }
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
