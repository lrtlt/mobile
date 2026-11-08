#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RDSFirestoreListener : NSObject

- (nullable instancetype)initWithDocumentPath:(NSString *)path
                                      handler:(void (^)(NSDictionary<NSString *, id> *_Nullable data,
                                                        NSError *_Nullable error))handler;
- (instancetype)init NS_UNAVAILABLE;
- (void)remove;

@end

NS_ASSUME_NONNULL_END
