import React, {useCallback, useRef, useState} from 'react';
import {StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {LinkingOptions, NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import SplashViewComponent from '../screens/splash/SplashScreenView';

import crashlytics from '@react-native-firebase/crashlytics';

import {selectAppIsReady} from '../redux/selectors';

import {DEEP_LINKING_URL_PREFIX, GEMIUS_VIEW_SCRIPT_ID} from '../constants';
import Gemius, {GemiusParams} from '../../react-native-gemius-plugin';
import MainStack, {MainStackParamList} from './MainStack';
import {SplashScreen} from '../screens';
import useHandleLaunchUrl from './useHandleLaunchUrl';
import useFirebaseMessaging from '../util/useFirebaseMessaging';
import {useTheme} from '../Theme';

const linking: LinkingOptions<MainStackParamList> = {
  prefixes: [DEEP_LINKING_URL_PREFIX],
  config: {
    initialRouteName: 'Home',
    screens: {
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
  const isAppReady = useSelector(selectAppIsReady);

  const routeNameRef = useRef<string>();
  const navRef = useRef<NavigationContainerRef<MainStackParamList>>(null);

  const theme = useTheme();

  useFirebaseMessaging(isNavigatorReady);
  useHandleLaunchUrl(isNavigatorReady);

  const onNavigationReady = useCallback(() => {
    routeNameRef.current = navRef.current?.getCurrentRoute()?.name;
    setNavigatorReady(true);
  }, []);

  const onNavigationStateChange = useCallback(() => {
    const currentRoute = navRef.current?.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    if (currentRouteName && routeNameRef.current !== currentRouteName) {
      const currentScreen = currentRouteName.toLowerCase();
      const params: GemiusParams = {
        screen: currentScreen,
        params: currentRoute?.params && JSON.stringify(currentRoute.params),
      };

      console.log('Current route:', currentRoute);
      crashlytics().log(`Current screen: ${currentScreen}\n Params:\n${JSON.stringify(params)}`);
      Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, params);
    }
    routeNameRef.current = currentRouteName;
  }, []);

  if (!isAppReady) {
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
        onStateChange={onNavigationStateChange}>
        <MainStack />
      </NavigationContainer>
    </>
  );
};

export default NavigatorComponent;
