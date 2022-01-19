#import <Foundation/Foundation.h>

@interface GSMPlayerData : NSObject < NSCopying, NSCoding >
@property(nonatomic, strong) NSString *currentDomain;
@property(nonatomic, strong) NSString *resolution;
@property(nonatomic, strong) NSNumber *volume;
@end

