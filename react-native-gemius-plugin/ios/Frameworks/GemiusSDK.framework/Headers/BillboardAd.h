//
//  AdBillboardView.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "AdDefine.h"

@interface GEMBillboardAd : UIView
@property (nonatomic, copy) onGEMAdReadyBlock                  onAdReady;
@property (nonatomic, copy) onGEMFailBlock                     onFail;
@property (nonatomic, copy) onGEMAdClosedBlock                 onAdClosed;
@property (nonatomic, copy) onGEMContentReadyBlock             onContentReady;

-(GEMBillboardAd*)initWithFrame:(CGRect)frame andPlacementId:(NSString *)placementId;
-(void)setPlacementId:(NSString *)placementId;
-(void)setReloadInterval:(int)intervalSec;
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

-(void)load;
@end
