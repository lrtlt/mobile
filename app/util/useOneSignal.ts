import {useEffect} from 'react';
import {Linking} from 'react-native';
import {OneSignal} from 'react-native-onesignal';
import {useDispatch} from 'react-redux';
import {ONE_SIGNAL_APP_ID} from '../constants';
import {setLaunchUrl} from '../redux/actions';

const useOneSignal = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    OneSignal.initialize(ONE_SIGNAL_APP_ID);

    OneSignal.Notifications.canRequestPermission().then((canRequest) => {
      if (canRequest) {
        OneSignal.Notifications.requestPermission(true);
      }
    });

    OneSignal.Notifications.addEventListener('click', async (e) => {
      console.log('OneSignal: notification click event:', e);
      const data = e.notification.additionalData as any;
      if (data && data.url) {
        Linking.canOpenURL(data.url).then((supported) => {
          console.log('Url:', data.url, 'Supported:', supported);
          if (supported) {
            dispatch(setLaunchUrl(data.url));
          }
        });
      }
    });
  }, []);
};

export default useOneSignal;
