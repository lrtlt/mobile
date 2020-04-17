//
//  GEMFullScreenAd.h
//  GemiusSDK
//
//  Created by Kuba on 26/11/2019.
//  Copyright © 2019 Gemius. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AdDefine.h"

@interface GEMFullScreenAd : NSObject

@property (nonatomic, copy) NSString                         *placementId;
@property (nonatomic, weak) UIViewController                 *rootViewController;
@property (nonatomic, copy) onGEMAdReadyBlock                onAdReady;
@property (nonatomic, copy) onGEMFailBlock                   onFail;
@property (nonatomic, copy) onGEMAdClosedBlock               onAdClosed;
@property (nonatomic, copy) onGEMContentReadyBlock           onContentReady;

- (instancetype)initWithPlacementId:(NSString *)placementId andRootViewController:(UIViewController *)viewController;
- (void)setCustomRequestParamWithKey:(NSString *)key andValue:(NSString *)value;
- (void)setLandscapeAllowed:(BOOL)isAllowed;
- (void)open;
- (void)load;
- (void)close;

/*!
 @param keywords - NSArray of strings
 */
- (void)setKeywords:(NSArray *)keywords;

/*!
 @param variables - NSDictionary with NSString for key and NSNumber for value
 */
- (void)setNumericalVariables:(NSDictionary *)variables;

/*!
 @param clusterVariables - NSDictionary with NSString for key and NSArray of NSNumber for value
 */
- (void)setClusterVariables:(NSDictionary *)clusterVariables;

@end

