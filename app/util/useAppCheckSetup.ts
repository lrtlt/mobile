import {firebase} from '@react-native-firebase/app-check';
import {useEffect} from 'react';
import analytics from '@react-native-firebase/analytics';
import Config from 'react-native-config';

const appCheckProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
appCheckProvider.configure({
  android: {
    provider: __DEV__ ? 'debug' : 'playIntegrity',
    debugToken: Config.APP_CHECK_DEBUG_TOKEN_ANDROID,
  },
  apple: {
    provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
    debugToken: Config.APP_CHECK_DEBUG_TOKEN_IOS,
  },
});

const verify = async () => {
  try {
    const {token} = await firebase.appCheck().getToken(true);

    if (token.length > 0) {
      console.log('AppCheck verification passed');
      analytics().logEvent('app_check_verification_passed');
    } else {
      console.warn('AppCheck verification warning');
      analytics().logEvent('app_check_verification_empty_token');
    }
  } catch (error) {
    console.warn('AppCheck verification failed');
    analytics().logEvent('app_check_verification_failed', {
      error: JSON.stringify(error),
    });
  }
};

const useAppCheckSetup = () => {
  useEffect(() => {
    firebase
      .appCheck()
      .initializeAppCheck({provider: appCheckProvider, isTokenAutoRefreshEnabled: true})
      .then(verify)
      .catch((e) => {
        console.warn('AppCheck initialization failed', e);
        analytics().logEvent('app_check_initialization_error');
      });
  }, []);
};

export default useAppCheckSetup;
