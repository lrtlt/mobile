import {useEffect} from 'react';
import {check, request, PERMISSIONS} from 'react-native-permissions';

const useAppTrackingPermission = () => {
  useEffect(() => {
    const checkForPermission = async () => {
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
