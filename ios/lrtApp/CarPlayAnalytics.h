#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CarPlayAnalytics : NSObject

+ (void)logEvent:(NSString *)name;

@end

NS_ASSUME_NONNULL_END
