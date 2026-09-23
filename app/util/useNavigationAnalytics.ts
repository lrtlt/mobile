import {useNavigation} from '@react-navigation/native';
import {useEffect, useMemo, useRef} from 'react';
import {debounce} from 'lodash';
import {useAuth0} from 'react-native-auth0';
import {logScreenView, getAnalytics} from '@react-native-firebase/analytics';
import {ReaderType, SmartoctoPage, trackPageView} from './smartocto';

const EVENT_DEBOUNCE_DURATION = 200;

export type TrackingParams = {
  viewId: string;
  title?: string;
  /** lrt.lt page metadata for smartocto. Omitted for screens that have no lrt.lt page. */
  smartocto?: SmartoctoPage;
};

const useNavigationAnalytics = (params?: TrackingParams) => {
  const navigation = useNavigation();

  const {user} = useAuth0();
  const readerType = useRef<ReaderType>('anonymous');
  readerType.current = user ? 'registered' : 'anonymous';

  const pushToAnalytics = useMemo(
    () =>
      debounce((p: TrackingParams) => {
        console.log('Tracking view:', p.viewId);
        if (p.smartocto) {
          trackPageView(p.smartocto, readerType.current);
        }

        logScreenView(getAnalytics(), {
          screen_name: p.title,
          screen_class: p.viewId.replace('https://www.lrt.lt', ''),
        });
      }, EVENT_DEBOUNCE_DURATION),
    [],
  );

  useEffect(() => {
    if (!params) {
      // Tracking was disabled (or the params are not ready yet): drop a view queued by an earlier render.
      pushToAnalytics.cancel();
      return;
    }

    if (navigation.isFocused()) {
      pushToAnalytics(params);
    }
    const listener = navigation.addListener('focus', () => {
      pushToAnalytics(params);
    });
    return () => {
      listener();
      // Unmount or a changed view: the view is no longer on screen when the debounce fires.
      pushToAnalytics.cancel();
    };
  }, [params?.viewId]);
};

export default useNavigationAnalytics;
