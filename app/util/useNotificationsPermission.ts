import {useEffect} from 'react';
import {checkNotifications, requestNotifications} from 'react-native-permissions';

const useNotificationsPermission = () => {
  useEffect(() => {
    const checkForPermission = async () => {
      const checkResult = await checkNotifications();
      console.log('NOTIFICATIONS_PERMISSION check result: ', checkResult.status);
      if (checkResult.status === 'denied') {
        const requestResult = await requestNotifications(['alert', 'badge', 'sound']);
        console.log('NOTIFICATIONS_PERMISSION request result: ', requestResult);
      }
    };
    checkForPermission();
  }, []);
};

export default useNotificationsPermission;
