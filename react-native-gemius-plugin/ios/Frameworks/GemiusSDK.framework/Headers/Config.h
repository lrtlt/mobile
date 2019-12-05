//
//  Config.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <UIKit/UIKit.h>

#define GEM_SDK_NAME                                @"GemiusSDK"
#define GEM_SDK_VERSION                             @"1.5.1"

@interface GEMConfig : NSObject
@property(nonatomic, assign) BOOL       loggingEnabled;
@property(nonatomic, assign) BOOL       cookiesAllowed;

+ (GEMConfig*)sharedInstance;

+ (NSString*)getSdkVersion;
- (void)setAppInfo:(NSString*)name version:(NSString*)version;
- (NSString*)getUA4WebView;
@end
