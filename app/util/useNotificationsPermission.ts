import {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {checkNotifications, requestNotifications} from 'react-native-permissions';

const useNotificationsPermission = () => {
  useEffect(() => {
    const checkForNotificationPermission = async () => {
      const checkResult = await checkNotifications();
      console.log('NOTIFICATIONS_PERMISSION check result: ', checkResult.status);
      if (checkResult.status === 'denied') {
        const requestResult = await requestNotifications(['alert', 'badge', 'sound']);
        console.log('NOTIFICATIONS_PERMISSION request result: ', requestResult);
      }
    };

    const checkForNotificationPostPermission = async () => {
      if (Platform.OS !== 'android') {
        // Only Android requires POST_NOTIFICATIONS permission
        return;
      }
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      console.log('POST_NOTIFICATIONS_PERMISSION check result: ', granted);
      if (!granted) {
        console.log(
          'POST_NOTIFICATIONS_PERMISSION request result: ',
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS),
        );
      }
    };
    checkForNotificationPermission();
    checkForNotificationPostPermission();
  }, []);
};

export default useNotificationsPermission;
