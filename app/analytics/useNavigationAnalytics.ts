import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {AppState} from 'react-native';
import {debounce} from 'lodash';
import {useAuth0} from 'react-native-auth0';
import {PageVisit, ReaderType, SmartoctoPage, trackPageView} from './smartocto';
import {PageContent, logPageView} from './googleAnalytics';

const EVENT_DEBOUNCE_DURATION = 200;

export type TrackingParams = {
  viewId: string;
  title?: string;
  /** lrt.lt page metadata for smartocto. Omitted for screens that have no lrt.lt page. */
  smartocto?: SmartoctoPage;
  /** Article type and id for the Firebase page_view. Omitted for screens that are not an article. */
  content?: PageContent;
};

const useNavigationAnalytics = (params?: TrackingParams) => {
  const navigation = useNavigation();

  const {user} = useAuth0();
  const readerType = useRef<ReaderType>('anonymous');
  readerType.current = user ? 'registered' : 'anonymous';

  // smartocto visit of the view on screen, ended when the screen loses focus
  const visit = useRef<PageVisit>(undefined);

  const endVisit = useCallback(() => {
    visit.current?.end();
    visit.current = undefined;
  }, []);

  const pushToAnalytics = useMemo(
    () =>
      debounce((p: TrackingParams) => {
        console.log('Tracking view:', p.viewId);
        endVisit();
        if (p.smartocto) {
          visit.current = trackPageView(p.smartocto, readerType.current);
          if (AppState.currentState !== 'active') {
            visit.current.pause();
          }
        }

        logPageView(p.viewId, p.title, p.content);
      }, EVENT_DEBOUNCE_DURATION),
    [endVisit],
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
    const focusListener = navigation.addListener('focus', () => {
      pushToAnalytics(params);
    });
    const blurListener = navigation.addListener('blur', () => {
      pushToAnalytics.cancel();
      endVisit();
    });
    return () => {
      focusListener();
      blurListener();
      pushToAnalytics.cancel();
      endVisit();
    };
  }, [params?.viewId]);

  // No attention while the app is in the background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        visit.current?.resume();
      } else {
        visit.current?.pause();
      }
    });
    return () => subscription.remove();
  }, []);
};

export default useNavigationAnalytics;
