#import "ContentData.h"

typedef NS_ENUM(NSInteger, GSMAdType) {
	GSM_PROMO = 1,
	GSM_SPOT, 
	GSM_SPONSOR
};

@interface GSMAdData : GSMContentData
@property(nonatomic, assign) GSMAdType adType;
@property(nonatomic, strong) NSString *campaignClassification;
@end

