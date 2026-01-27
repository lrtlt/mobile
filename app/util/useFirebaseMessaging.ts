import {useEffect} from 'react';
import {
  getInitialNotification,
  setBackgroundMessageHandler,
  getMessaging,
  getAPNSToken,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages,
  onMessage,
  onNotificationOpenedApp,
  experimentalSetDeliveryMetricsExportedToBigQueryEnabled,
} from '@react-native-firebase/messaging';
import {Linking} from 'react-native';
import useFCMTokenSync from './useFCMTokenSync';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  Event,
  AndroidCategory,
  AndroidStyle,
} from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {MMKV} from 'react-native-mmkv';

const INITIAL_URL_STORAGE_KEY = 'initialUrl';
const FOREGROUND_NOTIFICATION_CHANNEL_ID = 'lrt_foreground_notifications';

type NotificationData = {
  launchUrl?: string;
};

const storage = new MMKV({
  id: 'messaging-storage',
});

const _handleNotificationOpen = async (data: NotificationData | undefined, isInitial: boolean) => {
  const url = data?.launchUrl;
  console.log(`_handleNotificationOpen: isInitial:${isInitial} data:${JSON.stringify(data)}`);
  crashlytics().log(`_handleNotificationOpen: isInitial:${isInitial} data:${JSON.stringify(data)}`);
  if (url) {
    if (isInitial) {
      const initialUrl = storage.getString(INITIAL_URL_STORAGE_KEY);
      if (initialUrl == url) {
        crashlytics().log(`_handleNotificationOpen: initialUrl already handled: ${url}`);
        console.debug('initialUrl already handled');
        return;
      } else {
        crashlytics().log(`_handleNotificationOpen: saving initial url: ${url}`);
        storage.set(INITIAL_URL_STORAGE_KEY, url);
      }
    }
    await Linking.openURL(url);
  }
};

const _handleInitialNotification = async () => {
  const firebaseNotification = await getInitialNotification(getMessaging());
  if (firebaseNotification) {
    await _handleNotificationOpen(firebaseNotification.data as NotificationData, true);
  } else {
    const notifeeNotification = await notifee.getInitialNotification();
    if (notifeeNotification) {
      await _handleNotificationOpen(notifeeNotification.notification.data as NotificationData, true);
    }
  }
};

const _onNotificationEvent = async ({type, detail}: Event) => {
  if (type === EventType.PRESS) {
    await _handleNotificationOpen(detail.notification?.data as NotificationData, false);
  }
};

// Subscribe to background events from notifee notifications
notifee.onBackgroundEvent(_onNotificationEvent);

// Subscribe to background events from firebase-messaging
// This is required to avoid warning from firebase-messaging
setBackgroundMessageHandler(getMessaging(), async (_) => {});

const useFirebaseMessaging = (isNavigationReady: boolean) => {
  // Sync FCM token with backend
  useFCMTokenSync();

  //Setup firebase messaging && notification channels
  useEffect(() => {
    const init = async () => {
      if (!isDeviceRegisteredForRemoteMessages(getMessaging())) {
        await registerDeviceForRemoteMessages(getMessaging());
      }

      const apnsToken = await getAPNSToken(getMessaging());
      const token = await getToken(getMessaging());

      console.log('APNS-token', apnsToken);
      console.log('FCM-token', token);

      const isChannelCreated = await notifee.isChannelCreated(FOREGROUND_NOTIFICATION_CHANNEL_ID);
      if (!isChannelCreated) {
        await notifee.createChannel({
          id: FOREGROUND_NOTIFICATION_CHANNEL_ID,
          name: 'Foreground notifications',
        });
      }
      await experimentalSetDeliveryMetricsExportedToBigQueryEnabled(getMessaging(), true);
    };
    init();
  }, []);

  // Handle notification event subscriptions
  useEffect(() => {
    const unsubscribeNotificationOpen = onNotificationOpenedApp(getMessaging(), (remoteMessage) => {
      _handleNotificationOpen(remoteMessage.data as NotificationData, false);
    });

    const unsubscribeOnMessage = onMessage(getMessaging(), async (remoteMessage) => {
      if (remoteMessage.notification) {
        const iosFCMOptions: any = remoteMessage.data?.fcm_options;

        notifee.displayNotification({
          id: remoteMessage.messageId,
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
          ios: {
            attachments: iosFCMOptions?.image
              ? [
                  {
                    url: iosFCMOptions?.image as string,
                  },
                ]
              : [],
          },
          android: {
            style: remoteMessage.notification.android?.imageUrl
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
