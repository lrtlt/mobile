import {initializeAppCheck, firebase} from '@react-native-firebase/app-check';
import {useEffect} from 'react';
import {logEvent, getAnalytics} from '@react-native-firebase/analytics';
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
  isTokenAutoRefreshEnabled: true,
});

const verify = async () => {
  try {
    const {token} = await firebase.appCheck().getToken(true);
    if (token.length > 0) {
      console.log('AppCheck verification passed');
      logEvent(getAnalytics(), 'app_lrt_lt_check_verification_passed');
    } else {
      console.warn('AppCheck verification warning');
      logEvent(getAnalytics(), 'app_lrt_lt_check_verification_empty_token');
    }
  } catch (error) {
    console.warn('AppCheck verification failed');
    logEvent(getAnalytics(), 'app_lrt_lt_check_verification_failed', {
      error: JSON.stringify(error),
    });
  }
};

const useAppCheckSetup = () => {
  useEffect(() => {
    initializeAppCheck(firebase.app(), {provider: appCheckProvider, isTokenAutoRefreshEnabled: true})
      .then(verify)
      .catch((e) => {
        console.warn('AppCheck initialization failed', e);
        logEvent(getAnalytics(), 'app_lrt_lt_check_initialization_error');
      });
  }, []);
};

export default useAppCheckSetup;
