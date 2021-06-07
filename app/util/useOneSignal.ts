import {useEffect} from 'react';
import {Linking, Platform} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {useDispatch} from 'react-redux';
import {ONE_SIGNAL_APP_ID} from '../constants';
import {setLaunchUrl} from '../redux/actions';

const useOneSignal = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    OneSignal.setAppId(ONE_SIGNAL_APP_ID);
    OneSignal.getDeviceState()
      .then((deviceState) => console.log('OneSignal device state: ', deviceState))
      .catch((e) => console.log('OneSignal device error: ', e));

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse((response) => {
        console.log('OneSignal prompt response:', response);
      });
    }

    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      console.log('OneSignal: notification opened:', openedEvent);
      const data = openedEvent.notification.additionalData as any;
      if (data && data.url && Linking.canOpenURL(data.url)) {
        console.log('OneSignal: opening url:', data.url);
        dispatch(setLaunchUrl(data.url));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useOneSignal;
