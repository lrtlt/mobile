#import <Foundation/Foundation.h>

@interface GSMContentData : NSObject < NSCopying, NSCoding >
@property(nonatomic, strong) NSNumber *duration;
@property(nonatomic, strong) NSString *name;
@property(nonatomic, strong) NSString *quality;
@property(nonatomic, strong) NSString *resolution;
@property(nonatomic, strong) NSString *transmission;
@property(nonatomic, strong) NSNumber *volume;

-(void)addCustomParameter:(NSString*)key value:(NSString*)value;
-(NSMutableDictionary*)customParameters;

@end

