#import "CarPlayAnalytics.h"

@protocol CarPlayFirebaseAnalytics <NSObject>
+ (void)logEventWithName:(NSString *)name parameters:(nullable NSDictionary<NSString *, id> *)parameters;
@end

@implementation CarPlayAnalytics

+ (void)logEvent:(NSString *)name {
  Class<CarPlayFirebaseAnalytics> analytics =
      (Class<CarPlayFirebaseAnalytics>)NSClassFromString(@"FIRAnalytics");
  [analytics logEventWithName:name parameters:nil];
}

@end
