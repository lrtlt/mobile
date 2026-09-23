import {getApp} from '@react-native-firebase/app';
import {
  ReactNativeFirebaseAppCheckProvider,
  initializeAppCheck,
  getToken,
  type AppCheck,
} from '@react-native-firebase/app-check';
import {useEffect} from 'react';
import {logEvent, getAnalytics} from '@react-native-firebase/analytics';
import Config from 'react-native-config';

const appCheckProvider = new ReactNativeFirebaseAppCheckProvider();
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

const verify = async (appCheck: AppCheck) => {
  try {
    const {token} = await getToken(appCheck, true);
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
    try {
      const appCheck = initializeAppCheck(getApp(), {
        provider: appCheckProvider,
        isTokenAutoRefreshEnabled: true,
      });
      verify(appCheck);
    } catch (e) {
      console.warn('AppCheck initialization failed', e);
      logEvent(getAnalytics(), 'app_lrt_lt_check_initialization_error');
    }
  }, []);
};

export default useAppCheckSetup;