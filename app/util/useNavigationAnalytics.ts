import {useNavigation} from '@react-navigation/native';
import {useEffect, useMemo} from 'react';
import {ChartbeatTracker} from './useChartbeatSetup';
import {debounce} from 'lodash';
import {logScreenView, getAnalytics} from '@react-native-firebase/analytics';

const EVENT_DEBOUNCE_DURATION = 200;

export type TrackingParams = {
  viewId: string;
  title?: string;
  authors?: string[];
  sections?: string[];
};

const useNavigationAnalytics = (params?: TrackingParams) => {
  const navigation = useNavigation();

  const pushToAnalytics = useMemo(
    () =>
      debounce((p: TrackingParams) => {
        console.log('Tracking view:', p.viewId);
        ChartbeatTracker.trackView({
          viewId: p.viewId,
          title: p.title,
          authors: p.authors,
          sections: p.sections,
        });

        logScreenView(getAnalytics(), {
          screen_name: p.title,
          screen_class: p.viewId.replace('https://www.lrt.lt', ''),
        });
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  useEffect(() => {
    if (!params) {
      return;
    }

    if (navigation.isFocused()) {
      pushToAnalytics(params);
    }
    const listener = navigation.addListener('focus', () => {
      pushToAnalytics(params);
    });
    return listener;
  }, [params?.viewId]);
};

export default useNavigationAnalytics;
