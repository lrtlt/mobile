#import "GemiusPlugin.h"
#import <GemiusSDK/GemiusSDK.h>

@implementation GemiusPlugin

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

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

@end
