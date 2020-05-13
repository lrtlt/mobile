#import "GemiusPlugin.h"
#import <GemiusSDK/GemiusSDK.h>

@implementation GemiusPlugin

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

GSMPlayer *player;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setAppInfo:(NSString *)app version:(NSString *)version gemiusHitcollectorHost:(NSString *)gemiusHitcollectorHost gemiusPrismIdentifier:(NSString *)gemiusPrismIdentifier)
{
    [[GEMAudienceConfig sharedInstance] setHitcollectorHost:gemiusHitcollectorHost];
    [[GEMAudienceConfig sharedInstance] setScriptIdentifier:gemiusPrismIdentifier];
    [[GEMConfig sharedInstance] setLoggingEnabled:YES];
    [[GEMConfig sharedInstance] setAppInfo:app version:version];
}

RCT_EXPORT_METHOD(sendPageViewedEvent:(NSString *)gemiusPrismIdentifier params:(NSDictionary *) params)
{
    GEMAudienceEvent *event = [GEMAudienceEvent new];
    [event setEventType:GEM_EVENT_FULL_PAGEVIEW];
    [event setScriptIdentifier:gemiusPrismIdentifier];
    
    if(params != nil){
        for (NSString* key in params) {
            [event addExtraParameter:key value:params[key]];
        }
    }
    [event sendEvent];
}

RCT_EXPORT_METHOD(sendPartialPageViewedEvent:(NSString *)gemiusPrismIdentifier params:(NSDictionary *) params)
{
    GEMAudienceEvent *event = [GEMAudienceEvent new];
    [event setEventType:GEM_EVENT_PARTIAL_PAGEVIEW];
    [event setScriptIdentifier:gemiusPrismIdentifier];
    
    if(params != nil){
        for (NSString* key in params) {
            [event addExtraParameter:key value:params[key]];
        }
    }
    [event sendEvent];
}

RCT_EXPORT_METHOD(sendActionEvent:(NSString *)gemiusPrismIdentifier params:(NSDictionary *) params)
{
    GEMAudienceEvent *event = [GEMAudienceEvent new];
    [event setEventType:GEM_EVENT_ACTION];
    [event setScriptIdentifier:gemiusPrismIdentifier];
    
    if(params != nil){
        for (NSString* key in params) {
            [event addExtraParameter:key value:params[key]];
        }
    }
    [event sendEvent];
}

RCT_EXPORT_METHOD(setPlayerInfo:(NSString *)playerId
                  serverHost:(NSString *)serverHost
                  accountId:(NSString *)accountId)
{
    NSLog(@"Initializing player...");
    
    if(player == nil){
        player = [[GSMPlayer alloc] initWithID:playerId withHost:serverHost withGemiusID:accountId withData:nil];
    }else{
        NSLog(@"Player already initialized!");
    }
}

RCT_EXPORT_METHOD(setProgramData:(NSString *)clipId
                  name:(NSString *)name
                  duration:(nonnull NSNumber *)duration
                  type:(NSString *)type)
{
   NSLog(@"Setting new program data for %@ with duration %@", name, duration);
    
    GSMProgramData *pdata = [[GSMProgramData alloc] init];
    pdata.duration = duration;
    pdata.name = name;
    if([type isEqualToString:@"audio"]){
        pdata.programType = GSM_AUDIO;
    }else{
        pdata.programType = GSM_VIDEO;
    }
    
    [player newProgram:clipId withData:pdata];
}

RCT_EXPORT_METHOD(sendPlay:(NSString *)clipId offset:(nonnull NSNumber *)offset)
{
    NSLog(@"Player PLAY event for '%@' offset: %@", clipId, offset);
    
    if (player) {
        GSMEventProgramData *data = [[GSMEventProgramData alloc] init];
        data.autoPlay = [NSNumber numberWithBool:YES];
        [player programEvent:GSM_PLAY forProgram:clipId atOffset:offset withData:data];
    }
}

RCT_EXPORT_METHOD(sendPause:(NSString *)clipId offset:(nonnull NSNumber *)offset)
{
    NSLog(@"Player PAUSE event for '%@' offset: %@", clipId, offset);
    
    if (player) {
       [player programEvent:GSM_PAUSE forProgram:clipId atOffset:offset withData:nil];
    }
}

RCT_EXPORT_METHOD(sendStop:(NSString *)clipId offset:(nonnull NSNumber *)offset)
{
    NSLog(@"Player STOP event for '%@' offset: %@", clipId, offset);
    
    if (player) {
       [player programEvent:GSM_STOP forProgram:clipId atOffset:offset withData:nil];
    }
}

RCT_EXPORT_METHOD(sendBuffer:(NSString *)clipId offset:(nonnull NSNumber *)offset)
{
    NSLog(@"Player BUFFER event for '%@' offset: %@", clipId, offset);
    
    if (player) {
       [player programEvent:GSM_BUFFER forProgram:clipId atOffset:offset withData:nil];
    }
}

RCT_EXPORT_METHOD(sendClose:(NSString *)clipId offset:(nonnull NSNumber *)offset)
{
    NSLog(@"Player CLOSE event for '%@' offset: %@", clipId, offset);
    
    if (player) {
       [player programEvent:GSM_CLOSE forProgram:clipId atOffset:offset withData:nil];
    }
}

RCT_EXPORT_METHOD(sendSeek:(NSString *)clipId offset:(nonnull NSNumber *)offset)
{
    NSLog(@"Player SEEK event for '%@' offset: %@", clipId, offset);
    
    if (player) {
       [player programEvent:GSM_SEEK forProgram:clipId atOffset:offset withData:nil];
    }
}

RCT_EXPORT_METHOD(sendComplete:(NSString *)clipId offset:(nonnull NSNumber *)offset)
{
    NSLog(@"Player COMPLETE event for '%@' offset: %@", clipId, offset);
    
    if (player) {
       [player programEvent:GSM_COMPLETE forProgram:clipId atOffset:offset withData:nil];
    }
}


@end
