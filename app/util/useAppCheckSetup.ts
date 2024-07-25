import {firebase} from '@react-native-firebase/app-check';
import {useEffect} from 'react';

const rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
rnfbProvider.configure({
  android: {
    provider: __DEV__ ? 'debug' : 'playIntegrity',
    debugToken: '62BDDD90-4D52-41F2-9F2C-6DC6F3B398C9',
  },
  apple: {
    provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
    debugToken: '36DD3397-3EFC-4FB1-BD2B-8AF1151D7B85',
  },
});

const setup = async () => {
  await firebase.appCheck().initializeAppCheck({provider: rnfbProvider, isTokenAutoRefreshEnabled: true});
};

const verify = async () => {
  try {
    const {token} = await firebase.appCheck().getToken(true);

    if (token.length > 0) {
      console.log('AppCheck verification passed');
    }
  } catch (error) {
    console.warn('AppCheck verification failed');
  }
};

const useAppCheckSetup = () => {
  useEffect(() => {
    setup().then(verify).catch(console.error);
  }, []);
};

export default useAppCheckSetup;
