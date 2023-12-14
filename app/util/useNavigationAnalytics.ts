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
      debounce((p: TrackingParams) => {
        //console.log(`ANALYTICS - Lrt.lt app - ${p.title}`);
        ChartbeatTracker.trackView({
          viewId: `Lrt.lt app - ${p.type}`,
          title: `Lrt.lt app - ${p.title}`,
          authors: p.authors,
          sections: p.sections,
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
