import UIKit
import CarPlay
import React
import React_RCTAppDelegate
import Firebase
import GoogleCast

#if DEBUG
#if FB_SONARKIT_ENABLED
import FlipperKit
#endif
#endif

@main
class AppDelegate: RCTAppDelegate, GCKLoggerDelegate {

  
  var rootView: UIView?;
  var concurrentRootEnabled = true;

  static var shared: AppDelegate { return UIApplication.shared.delegate as! AppDelegate }

  
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]?) -> Bool {
    FirebaseApp.configure();
    let kReceiverAppID = kGCKDefaultMediaReceiverApplicationID
    let criteria = GCKDiscoveryCriteria(applicationID: kReceiverAppID)
    let options = GCKCastOptions(discoveryCriteria: criteria)
    GCKCastContext.setSharedInstanceWith(options)
  
    moduleName = "lrtApp"
    
    let app = super.application(application, didFinishLaunchingWithOptions: launchOptions);
    
    self.rootView = self.createRootView(
      with: self.bridge,
      moduleName: self.moduleName,
      initProps: self.prepareInitialProps()
    );
    return app;
  }

  override func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
    if (connectingSceneSession.role == UISceneSession.Role.carTemplateApplication) {
      let scene =  UISceneConfiguration(name: "CarPlay", sessionRole: connectingSceneSession.role)
      scene.delegateClass = CarSceneDelegate.self
      return scene
    } else {
      let scene =  UISceneConfiguration(name: "Phone", sessionRole: connectingSceneSession.role)
      scene.delegateClass = PhoneSceneDelegate.self
      return scene
    }
  }

  override func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index");
    #else
      return Bundle.main.url(forResource:"main", withExtension:"jsbundle")
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
  
  override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
      return RCTLinkingManager.application(application, open: url, options: options)
  }
}
