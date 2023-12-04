//
//  BaseEvent.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, GEMEventType) {
    GEM_EVENT_FULL_PAGEVIEW,
    GEM_EVENT_PARTIAL_PAGEVIEW,
    GEM_EVENT_SONAR,
    GEM_EVENT_ACTION,
    GEM_EVENT_STREAM,
    GEM_EVENT_DATA
};

#define GEM_EventTypeString(enum) [@[@"&et=view&hsrc=1",@"&et=view&hsrc=2",@"&et=sonar&hsrc=2", @"&et=action&hsrc=3", @"&et=stream&hsrc=2",@"&et=data&hsrc=3"] objectAtIndex:enum]

@interface GEMBaseEvent : NSObject

//Properties
//---------------------------------------
@property(nonatomic, assign) GEMEventType   eventType;
@property(nonatomic, strong) NSString       *hitcollectorHost;
@property(nonatomic, strong) NSString       *scriptIdentifier;

//Methods
//---------------------------------------
-(void)setExtraParameters:(NSDictionary*)extraParameters;
-(NSDictionary*)getExtraParameters;
-(void)addExtraParameter:(NSString*)key value:(NSString*)value;
-(void)removeExtraParameter:(NSString*)key;
-(void)sendEvent;

@end
