import {setConsent, setAnalyticsCollectionEnabled, getAnalytics} from '@react-native-firebase/analytics';
import {useEffect} from 'react';

const useGoogleAnalyticsSetup = () => {
  useEffect(() => {
    setConsent(getAnalytics(), {
      ad_storage: true,
      ad_personalization: true,
      ad_user_data: true,
      analytics_storage: true,
    }).then(() => {
      console.log('GOOGLE ANALYTICS CONSENTS SET');
      setAnalyticsCollectionEnabled(getAnalytics(), true);
    });
  }, []);
};

export default useGoogleAnalyticsSetup;
