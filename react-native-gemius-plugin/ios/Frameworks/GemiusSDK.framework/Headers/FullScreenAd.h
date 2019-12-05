//
//  AdInterstitial.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "AdDefine.h"

@interface GEMFullScreenAd : NSObject
@property(nonatomic, copy) NSString                         *placementId;
@property(nonatomic, weak) UIViewController                 *rootViewController;
@property (nonatomic, copy) onGEMAdReadyBlock                onAdReady;
@property (nonatomic, copy) onGEMFailBlock                   onFail;
@property (nonatomic, copy) onGEMAdClosedBlock               onAdClosed;
@property (nonatomic, copy) onGEMContentReadyBlock           onContentReady;


-(GEMFullScreenAd*)initWithPlacementId:(NSString *)placementId andRootViewController:(UIViewController *)viewController;
-(void)setPlacementId:(NSString *)placementId;
-(void)setCustomRequestParamWithKey:(NSString *)key andValue:(NSString *)value;
//-(void)setCompleteRequestURL:(NSString*)url;

/*!
 @param keywords - NSArray of strings
 */
-(void)setKeywords:(NSArray *)keywords;

/*!
 @param variables - NSDictionary with NSString for key and NSNumber for value
 */
-(void)setNumericalVariables:(NSDictionary *)variables;

/*!
 @param clusterVariables - NSDictionary with NSString for key and NSArray of NSNumber for value
 */
-(void)setClusterVariables:(NSDictionary *)clusterVariables;

-(void)setLandscapeAllowed:(BOOL)isAllowed;
-(void)open;
-(void)load;
-(void)close;
@end
