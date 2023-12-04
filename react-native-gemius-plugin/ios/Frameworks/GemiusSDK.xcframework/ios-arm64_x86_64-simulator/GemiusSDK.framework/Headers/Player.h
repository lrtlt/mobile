#import <Foundation/Foundation.h>
#import "ProgramData.h"
#import "AdData.h"
#import "EventProgramData.h"
#import "EventAdData.h"
#import "PlayerData.h"

typedef NS_ENUM(NSInteger, GSMEventType) {
	GSM_PLAY, GSM_PAUSE, GSM_STOP, GSM_CLOSE, GSM_BUFFER, GSM_BREAK, GSM_SEEK, GSM_COMPLETE, GSM_SKIP, GSM_NEXT, GSM_PREV, GSM_CHANGE_VOL, GSM_CHANGE_QUAL, GSM_CHANGE_RES
};


@interface GSMPlayer : NSObject < NSCoding >

-(id) init __attribute__((unavailable("init not available"))); 

-(GSMPlayer*)initWithID:(NSString*)playerID
	withHost:(NSString*)hitCollectorHost
	withGemiusID:(NSString*)gemiusID
	withData:(GSMPlayerData*)playerData;

-(void)newProgram:(NSString*)programID 
	withData:(GSMProgramData*)programData;

-(void)newAd:(NSString*)adID 
	withData:(GSMAdData*)adData;

-(void)programEvent:(GSMEventType)eventType 
	forProgram:(NSString*)programID
	atOffset:(NSNumber*)offset
	withData:(GSMEventProgramData*)eventData;

-(void)adEvent:(GSMEventType)eventType
	forProgram:(NSString*)programID
	forAd:(NSString*)adID
	atOffset:(NSNumber*)offset
	withData:(GSMEventAdData*)eventData;

@end

