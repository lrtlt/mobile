//
//  AdDefine.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#ifndef AdDefine_h
#define AdDefine_h

typedef void (^onGEMAdReadyBlock)(BOOL hasAd);
typedef void (^onGEMFailBlock)(NSError *error);
typedef void (^onGEMAdClosedBlock)(void);
typedef void (^onGEMContentReadyBlock)(void);

#endif /* AdDefine_h */
