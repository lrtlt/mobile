//
//  AdOceanConfig.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GEMAdOceanConfig : NSObject
@property(nonatomic, strong) NSString   *emitterHost;
@property(nonatomic, strong) NSString   *baseUrl;
+ (GEMAdOceanConfig*)sharedInstance;
@end
