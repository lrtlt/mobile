#import <Foundation/Foundation.h>

@interface GSMEventData : NSObject

@property(nonatomic, strong) NSNumber *autoPlay;
@property(nonatomic, strong) NSNumber *volume;
@property(nonatomic, strong) NSString *resolution;
@property(nonatomic, strong) NSString *quality;
@property(nonatomic, strong) NSString *listID;

- (void)addCustomParameter:(NSString *)key value:(NSString *)value;

@end

