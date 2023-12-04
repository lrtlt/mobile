//
//  NetpanelConfig.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import "BaseConfig.h"

@interface GEMNetpanelConfig : GEMBaseConfig

@property(nonatomic, strong)NSString    *netpanelUID;

+(void)sendBufferedEvents;
+(GEMNetpanelConfig*)sharedInstance;

@end
