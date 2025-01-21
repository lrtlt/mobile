import CarPlay
import Firebase
import GoogleCast
import RNFBAppCheck
import React
import React_RCTAppDelegate
import UIKit

@main
class AppDelegate: RCTAppDelegate, GCKLoggerDelegate {

  var rootView: UIView?
  var concurrentRootEnabled = true

  static var shared: AppDelegate { return UIApplication.shared.delegate as! AppDelegate }

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    RNFBAppCheckModule.sharedInstance()
    FirebaseApp.configure()

    let kReceiverAppID = kGCKDefaultMediaReceiverApplicationID
    let criteria = GCKDiscoveryCriteria(applicationID: kReceiverAppID)
    let options = GCKCastOptions(discoveryCriteria: criteria)
    GCKCastContext.setSharedInstanceWith(options)

    moduleName = "lrtApp"
    return true

    // Moved initialization to scenes

    //    let app = super.application(application, didFinishLaunchingWithOptions: launchOptions);
    //
    //
    //    self.rootView = self.createRootView(
    //      with: self.bridge,
    //      moduleName: self.moduleName,
    //      initProps: self.prepareInitialProps()
    //    );
    //    return app;
  }

  func initAppFromScene(connectionOptions: UIScene.ConnectionOptions?) {
    // If bridge has already been initiated by another scene, there's nothing to do here
    if self.bridge != nil {
      return
    }

    let enableTM = false
    #if RCT_NEW_ARCH_ENABLED
      enableTM = self.turboModuleEnabled
    #endif

    let application = UIApplication.shared
    RCTAppSetupPrepareApp(application, enableTM)

    //Prepare launchOptions if application launched from Universal Link
    var launchOptions: [AnyHashable: Any] = [:]
    let launchUrl = connectionOptions?.userActivities.first?.webpageURL
    if launchUrl != nil {
      launchOptions = [UIApplication.LaunchOptionsKey.url: launchUrl ?? ""]
    }

    var bridge: RCTBridge? = nil

    if self.bridge == nil {
      print("Creating new bridge...")
      bridge = super.createBridge(
        with: self,
        launchOptions: launchOptions
      )
      self.bridge = bridge
    }

    #if RCT_NEW_ARCH_ENABLED
      _contextContainer = UnsafeMutablePointer<ContextContainer>.allocate(capacity: 1)
      _contextContainer?.initialize(to: ContextContainer())
      _reactNativeConfig = UnsafeMutablePointer<EmptyReactNativeConfig>.allocate(capacity: 1)
      _reactNativeConfig?.initialize(to: EmptyReactNativeConfig())
      _contextContainer?.pointee.insert("ReactNativeConfig", _reactNativeConfig)
      self.bridgeAdapter = RCTSurfacePresenterBridgeAdapter(
        bridge: self.bridge, contextContainer: _contextContainer)
      self.bridge?.surfacePresenter = self.bridgeAdapter?.surfacePresenter
    #endif

    let initProps = self.prepareInitialProps()
    self.rootView = self.createRootView(
      with: bridge!, moduleName: self.moduleName!, initProps: initProps)

    if #available(iOS 13.0, *) {
      self.rootView!.backgroundColor = UIColor.systemBackground
    } else {
      self.rootView!.backgroundColor = UIColor.white
    }
  }

  override func application(
    _ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession,
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

  override func sourceURL(for bridge: RCTBridge?) -> URL {
    return getBundleURL()
  }

  func getBundleURL() -> URL {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")!
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    #endif
  }

  // not exposed from RCTAppDelegate, recreating.
  func prepareInitialProps() -> [String: Any] {
    var initProps = self.initialProps as? [String: Any] ?? [String: Any]()
    #if RCT_NEW_ARCH_ENABLED
      initProps["kRNConcurrentRoot"] = concurrentRootEnabled()
    #endif
    return initProps
  }

  // Not working any more because it's setup is moved to PhoneScene
  //  override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  //      return RCTLinkingManager.application(application, open: url, options: options)
  //  }
}
