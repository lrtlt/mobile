#import "ContentData.h"

typedef NS_ENUM(NSInteger, GSMProgramType) {
	GSM_AUDIO = 1,
	GSM_VIDEO 
};

typedef NS_ENUM(NSInteger, GSMProgramGenre) {
    GSMProgramGenreUndefined   = 0,
    GSMProgramGenreLiveProgram = 1,
    GSMProgramGenreFilm        = 2,
    GSMProgramGenreSeries      = 3,
    GSMProgramGenreProgram     = 4,
    GSMProgramGenreMusic       = 5,
    GSMProgramGenreTrailer     = 6
};

typedef NS_ENUM(NSInteger, GSMTransmissionType) {
    GSMTransmissionTypeUndefined = 0,
    GSMTransmissionTypeOnDemand  = 1,
    GSMTransmissionTypeBroadcast = 2
};

@interface GSMProgramData : GSMContentData

@property (nonatomic) GSMProgramType programType;
@property (nonatomic, copy) NSString *series;
@property (nonatomic, copy) NSString *typology;
@property (nonatomic, copy) NSString *premiereDate;
@property (nonatomic, copy) NSString *externalPremiereDate;
@property (nonatomic) GSMProgramGenre programGenre;
@property (nonatomic, copy) NSString *programPartialName;
@property (nonatomic, copy) NSString *programProducer;
@property (nonatomic, copy) NSString *programThematicCategory;
@property (nonatomic, copy) NSString *programSeason;
@property (nonatomic, copy) NSString *transmissionChannel;
@property (nonatomic, copy) NSString *transmissionStartTime;
@property (nonatomic) GSMTransmissionType transmissionType;

@end

