import React, {useCallback, useRef, useState} from 'react';
import {StatusBar} from 'react-native';
import {LinkingOptions, NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import SplashViewComponent from '../screens/splash/SplashScreenView';

import crashlytics from '@react-native-firebase/crashlytics';

import {DEEP_LINKING_URL_PREFIX} from '../constants';
import Gemius, {GemiusParams} from 'react-native-gemius-plugin';
import MainStack, {MainStackParamList} from './MainStack';
import {SplashScreen} from '../screens';
import useFirebaseMessaging from '../util/useFirebaseMessaging';
import {useTheme} from '../Theme';
import {useArticleStore} from '../state/article_store';
import {useShallow} from 'zustand/shallow';
import Config from 'react-native-config';
import {checkEqual} from '../util/LodashEqualityCheck';
import {useNavigationStore} from '../state/navigation_store';

const linking: LinkingOptions<MainStackParamList> = {
  prefixes: [DEEP_LINKING_URL_PREFIX, 'https://www.lrt.lt'],
  config: {
    initialRouteName: 'Home',
    screens: {
      ArticleDeepLinkProxy: {
        path: '/naujienos/:category/*/:articleId/:title',
      },
      Vodcast: {
        path: '/mediateka/irasas/:articleId/:title',
      },
      Podcast: {
        path: '/radioteka/irasas/:articleId/:title',
      },
      Article: {
        path: 'article/:articleId',
      },
      Channel: {
        path: 'channel/:channelId',
      },
    },
  },
};

const NavigatorComponent: React.FC<React.PropsWithChildren<{}>> = () => {
  const [isNavigatorReady, setNavigatorReady] = useState(false);
  const isAppReady = useArticleStore(useShallow((state) => state.home.items.length > 0));
  const isOfflineMode = useNavigationStore((state) => state.isOfflineMode);
  const routeNameRef = useRef<string | undefined>(undefined);
  const routeParamsRef = useRef<any>({});
  const navRef = useRef<NavigationContainerRef<MainStackParamList>>(null);

  const theme = useTheme();

  useFirebaseMessaging(isNavigatorReady);

  const trackRoute = useCallback(() => {
    const currentRoute = navRef.current?.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    if (currentRouteName) {
      const currentScreen = currentRouteName.toLowerCase();
      const params: GemiusParams = {
        screen: currentScreen,
        params: currentRoute?.params && JSON.stringify(currentRoute.params),
      };

      if (!checkEqual(routeParamsRef.current, params)) {
        console.log('Current route:', currentRoute);
        crashlytics().log(`Current screen: ${currentScreen}\n Params:\n${JSON.stringify(params)}`);
        Gemius.sendPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, params);
        routeParamsRef.current = params;
      }
    }
    routeNameRef.current = currentRouteName;
  }, []);

  const onNavigationReady = useCallback(() => {
    setNavigatorReady(true);
    trackRoute();
  }, []);

  if (!isAppReady && !isOfflineMode) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        translucent={false}
        backgroundColor={theme.colors.statusBar}
      />
      <NavigationContainer
        ref={navRef}
        theme={theme}
        linking={linking}
        fallback={<SplashViewComponent />}
        onReady={onNavigationReady}
        onStateChange={trackRoute}>
        <MainStack />
      </NavigationContainer>
    </>
  );
};

export default NavigatorComponent;
