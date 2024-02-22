import analytics from '@react-native-firebase/analytics';
import {useEffect} from 'react';

const useGoogleAnalyticsSetup = () => {
  useEffect(() => {
    analytics()
      .setConsent({
        ad_storage: true,
        ad_personalization: true,
        ad_user_data: true,
        analytics_storage: true,
      })
      .then(() => analytics().setAnalyticsCollectionEnabled(true));
  }, []);
};

export default useGoogleAnalyticsSetup;
