//
//  AudienceConfig.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "BaseConfig.h"

@interface GEMAudienceConfig : GEMBaseConfig

@property(nonatomic, assign) BOOL       bufferedMode;
@property(nonatomic, strong) NSNumber   *bufferFlushInterval;
@property(nonatomic, assign) BOOL       powerSavingMode;

+(GEMAudienceConfig*)sharedInstance;

@end
