import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFirebaseTopicSubscription from './useFirebaseTopicSubscription';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  Event,
  AndroidCategory,
  AndroidBadgeIconType,
  AndroidStyle,
  AndroidBigPictureStyle,
} from '@notifee/react-native';

const INITIAL_URL_STORAGE_KEY = 'initialUrl';
const FOREGROUND_NOTIFICATION_CHANNEL_ID = 'lrt_foreground_notifications';

type NotificationData = {
  launchUrl?: string;
};

const _handleNotificationOpen = (data: NotificationData | undefined, isInitial: boolean) => {
  const url = data?.launchUrl;
  if (url) {
    Linking.canOpenURL(url).then(async (supported) => {
      if (supported) {
        if (isInitial) {
          const initialUrl = await AsyncStorage.getItem(INITIAL_URL_STORAGE_KEY);
          if (initialUrl === url) {
            console.debug('initialUrl already handled');
            return;
          } else {
            AsyncStorage.setItem(INITIAL_URL_STORAGE_KEY, url);
          }
        }
        Linking.openURL(url);
      }
    });
  }
};

const _handleInitialNotification = async () => {
  const firebaseNotification = await messaging().getInitialNotification();
  if (firebaseNotification) {
    _handleNotificationOpen(firebaseNotification.data as NotificationData, true);
  } else {
    const notifeeNotification = await notifee.getInitialNotification();
    if (notifeeNotification) {
      _handleNotificationOpen(notifeeNotification.notification.data as NotificationData, true);
    }
  }
};

const _onNotificationEvent = async ({type, detail}: Event) => {
  switch (type) {
    case EventType.PRESS:
      detail.notification;
      _handleNotificationOpen(detail.notification?.data as NotificationData, false);
      break;
  }
};

// Subscribe to background events from notifee notifications
notifee.onBackgroundEvent(_onNotificationEvent);

// Subscribe to background events from firebase-messaging
// This is required to avoid warning from firebase-messaging
messaging().setBackgroundMessageHandler(async (_) => {});

const useFirebaseMessaging = (isNavigationReady: boolean) => {
  useFirebaseTopicSubscription();

  //Setup firebase messaging && notification channels
  useEffect(() => {
    const init = async () => {
      const token = await messaging().getToken();
      const apnsToken = await messaging().getAPNSToken();
      console.log('FCM-token', token);
      console.log('APNS-token', apnsToken);

      const isChannelCreated = await notifee.isChannelCreated(FOREGROUND_NOTIFICATION_CHANNEL_ID);

      if (!isChannelCreated) {
        await notifee.createChannel({
          id: FOREGROUND_NOTIFICATION_CHANNEL_ID,
          name: 'Foreground notifications',
        });
      }
    };
    init();
  }, []);

  // Handle notification event subscriptions
  useEffect(() => {
    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
      _handleNotificationOpen(remoteMessage.data as NotificationData, false);
    });

    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const iosFCMOptions = remoteMessage.data?.fcm_options as any;

        notifee.displayNotification({
          id: remoteMessage.messageId,
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
          ios: {
            attachments: !!iosFCMOptions?.image
              ? [
                  {
                    url: iosFCMOptions?.image as string,
                  },
                ]
              : [],
          },
          android: {
            style: !!remoteMessage.notification.android?.imageUrl
              ? {
                  type: AndroidStyle.BIGPICTURE,
                  picture: remoteMessage.notification.android?.imageUrl!,
                }
              : {
                  type: AndroidStyle.BIGTEXT,
                  text: remoteMessage.notification.body ?? '',
                },
            channelId: FOREGROUND_NOTIFICATION_CHANNEL_ID,
            color: remoteMessage.notification.android?.color,
            smallIcon: remoteMessage.notification.android?.smallIcon,
            localOnly: true,
            visibility: AndroidVisibility.PUBLIC,
            importance: AndroidImportance.DEFAULT,
            category: AndroidCategory.RECOMMENDATION,
            pressAction: {
              id: 'lrt_on_notification_press',
              launchActivity: 'default',
            },
          },
        });
      }
    });

    const unsubscribeForegroundEvents = notifee.onForegroundEvent(_onNotificationEvent);

    return () => {
      unsubscribeNotificationOpen();
      unsubscribeOnMessage();
      unsubscribeForegroundEvents();
    };
  }, []);

  // Handle initial notification open
  useEffect(() => {
    if (!isNavigationReady) {
      return;
    }
    _handleInitialNotification();
  }, [isNavigationReady]);
};

export default useFirebaseMessaging;
