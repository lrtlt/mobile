#import "RDSFirestoreListener.h"

@protocol RDSFirestoreDocumentSnapshot <NSObject>
- (nullable NSDictionary<NSString *, id> *)data;
@end

@protocol RDSFirestoreListenerRegistration <NSObject>
- (void)remove;
@end

@protocol RDSFirestoreDocumentReference <NSObject>
- (id<RDSFirestoreListenerRegistration>)addSnapshotListener:
    (void (^)(id<RDSFirestoreDocumentSnapshot> _Nullable snapshot, NSError *_Nullable error))listener;
@end

@protocol RDSFirestore <NSObject>
+ (id)firestore;
- (id<RDSFirestoreDocumentReference>)documentWithPath:(NSString *)path;
@end

@implementation RDSFirestoreListener {
  id<RDSFirestoreListenerRegistration> _registration;
}

- (nullable instancetype)initWithDocumentPath:(NSString *)path
                                      handler:(void (^)(NSDictionary<NSString *, id> *_Nullable data,
                                                        NSError *_Nullable error))handler {
  Class<RDSFirestore> firestoreClass = (Class<RDSFirestore>)NSClassFromString(@"FIRFirestore");
  if (firestoreClass == nil) {
    return nil;
  }
  if (self = [super init]) {
    id<RDSFirestore> db = [firestoreClass firestore];
    _registration = [[db documentWithPath:path]
        addSnapshotListener:^(id<RDSFirestoreDocumentSnapshot> snapshot, NSError *error) {
          handler(snapshot.data, error);
        }];
  }
  return self;
}

- (void)remove {
  [_registration remove];
  _registration = nil;
}

@end
