#import <Firebase.h>
#import <GoogleCast/GoogleCast.h>
#import "AppDelegate.h"
#import "CarSceneDelegate.h"
#import "PhoneSceneDelegate.h"


#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTBridge.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];

  NSString *receiverAppID = kGCKDefaultMediaReceiverApplicationID;
  GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc] initWithApplicationID:receiverAppID];
  GCKCastOptions* options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
  [GCKCastContext setSharedInstanceWithOptions:options];

  self.moduleName = @"lrtApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  BOOL app = [super application:application didFinishLaunchingWithOptions:launchOptions];
  self.rootView = [[RCTRootView alloc] initWithBridge:self.bridge moduleName:self.moduleName initialProperties:self.initialProps];
  
//self.rootView = [self createRootViewWithBridge:self.bridge moduleName:self.moduleName initProps:self.initialProps];
  return app;
}

- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
    if (connectingSceneSession.role == UIWindowSceneSessionRoleExternalDisplay) {
        UISceneConfiguration *scene = [UISceneConfiguration configurationWithName:@"CarPlay" sessionRole:connectingSceneSession.role];
        scene.delegateClass = [CarSceneDelegate class];
        return scene;
    } else {
        UISceneConfiguration *scene = [UISceneConfiguration configurationWithName:@"Phone" sessionRole:connectingSceneSession.role];
        scene.delegateClass = [PhoneSceneDelegate class];
        return scene;
    }
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
@end
