#import "ContentData.h"

typedef NS_ENUM(NSInteger, GSMProgramType) {
	GSM_AUDIO = 1,
	GSM_VIDEO 
};

@interface GSMProgramData : GSMContentData
@property(nonatomic, assign) GSMProgramType programType;
@property(nonatomic, strong) NSString *series;
@property(nonatomic, strong) NSString *typology;
@property(nonatomic, strong) NSString *premiereDate;
@property(nonatomic, strong) NSString *externalPremiereDate;
@end

