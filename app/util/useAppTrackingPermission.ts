import {useEffect} from 'react';
import {Platform} from 'react-native';
import {check, request, PERMISSIONS} from 'react-native-permissions';

const useAppTrackingPermission = () => {
  useEffect(() => {
    const checkForPermission = async () => {
      if (Platform.OS !== 'ios') {
        return;
      }
      const checkResult = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      console.log('APP_TRACKING_TRANSPARENCY check result: ', checkResult);
      if (checkResult === 'denied') {
        const requestResult = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        console.log('APP_TRACKING_TRANSPARENCY request result: ', requestResult);
      }
    };

    checkForPermission();
  }, []);
};

export default useAppTrackingPermission;
