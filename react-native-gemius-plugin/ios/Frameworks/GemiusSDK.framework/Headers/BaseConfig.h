//
//  BaseConfig.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GEMBaseConfig : NSObject

@property(nonatomic, strong) NSString       *hitcollectorHost;
@property(nonatomic, strong) NSString       *scriptIdentifier;
@property(nonatomic, strong) NSDictionary   *extraParameters;

@property(nonatomic, assign) NSInteger      bufferSize;
@property(nonatomic, assign) NSInteger      bufferingTimeout;

@end
