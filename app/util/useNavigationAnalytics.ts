import {useNavigation} from '@react-navigation/native';
import {useEffect, useMemo} from 'react';
import {ChartbeatTracker} from './useChartbeatSetup';
import {debounce} from 'lodash';

const EVENT_DEBOUNCE_DURATION = 200;

export type TrackingParams = {
  type: string;
  title?: string;
  authors?: string[];
  sections?: string[];
};

const useNavigationAnalytics = (params?: TrackingParams) => {
  const navigation = useNavigation();

  const pushToAnalytics = useMemo(
    () =>
      debounce((params: TrackingParams) => {
        console.log(`ANALYTICS - tracking page: ${params.type}`);
        ChartbeatTracker.trackView({
          viewId: `Lrt.lt app - ${params.type}`,
          title: `Lrt.lt app - ${params.title}`,
          authors: params.authors,
          sections: params.sections,
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
  }, [params]);
};

export default useNavigationAnalytics;
