//
//  Config.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <UIKit/UIKit.h>

#define GEM_SDK_NAME    @"GemiusSDK"
#define GEM_SDK_VERSION @"2.0.2"

@interface GEMConfig : NSObject

@property (nonatomic) BOOL loggingEnabled;
@property (nonatomic) BOOL cookiesAllowed;
@property (nonatomic) BOOL IDFACollectionEnabled;

+ (GEMConfig *)sharedInstance;
+ (NSString *)getSdkVersion;

- (void)setAppInfo:(NSString*)name version:(NSString*)version;
- (NSString *)getUA4WebView;

@end
