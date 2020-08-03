#import "ContentData.h"

typedef NS_ENUM(NSInteger, GSMAdType) {
	GSM_PROMO = 1,
	GSM_SPOT, 
	GSM_SPONSOR,
    GSM_AD_BREAK
};

typedef NS_ENUM(NSInteger, GSMAdFormat) {
    GSMAdFormatUndefined = 0,
    GSMAdFormatVideo     = 1,
    GSMAdFormatAudio     = 2
};

@interface GSMAdData : GSMContentData

@property (nonatomic) GSMAdType adType;
@property (nonatomic) GSMAdFormat adFormat;
@property (nonatomic, copy) NSString *campaignClassification;

@end

