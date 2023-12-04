//
//  GEMBillboardAd.h
//  GemiusSDK
//
//  Created by Jakub Lyskawka on 09/11/2019.
//  Copyright © 2019 Gemius. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AdDefine.h"

@interface GEMBillboardAd : UIView

@property (nonatomic, copy) onGEMAdReadyBlock                  onAdReady;
@property (nonatomic, copy) onGEMFailBlock                     onFail;
@property (nonatomic, copy) onGEMAdClosedBlock                 onAdClosed;
@property (nonatomic, copy) onGEMContentReadyBlock             onContentReady;
@property (nonatomic, weak) UIViewController                   *rootViewController;
@property (nonatomic, readonly) CGSize                         optimalSize;

- (instancetype)initWithFrame:(CGRect)frame andPlacementId:(NSString *)placementId;
- (void)setPlacementId:(NSString *)placementId;
- (void)setReloadInterval:(int)intervalSec;
- (void)setCustomRequestParamWithKey:(NSString *)key andValue:(NSString *)value;
- (void)load;

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

