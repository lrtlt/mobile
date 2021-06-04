import React, {useRef} from 'react';
import {Linking, StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import SplashViewComponent from '../screens/splash/SplashScreenView';

import crashlytics from '@react-native-firebase/crashlytics';

import {selectNavigationIsReady} from '../redux/selectors';
import {themeDark, themeLight} from '../Theme';
import {useSettings} from '../settings/useSettings';
import {DEEP_LINKING_URL_PREFIX, GEMIUS_VIEW_SCRIPT_ID} from '../constants';
import Gemius, {GemiusParams} from '../../react-native-gemius-plugin';
import MainStack from './MainStack';
import {SplashScreen} from '../screens';

const linking = {
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

const NavigatorComponent = () => {
  const isNavigationReady = useSelector(selectNavigationIsReady);

  const settings = useSettings();
  console.log('SETTINGS', settings);

  const routeNameRef = useRef<string>();
  const navRef = useRef<NavigationContainerRef>(null);

  const onNavigationReady = () => {
    routeNameRef.current = navRef.current?.getCurrentRoute()?.name;
  };

  Linking.getInitialURL().then((initialUrl) => {
    console.log('INITIAL URL:', initialUrl);
  });

  const onNavigationStateChange = () => {
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
  };

  if (!isNavigationReady) {
    return <SplashScreen />;
  }

  const theme = settings.isDarkMode ? themeDark : themeLight;
  return (
    <>
      <StatusBar
        barStyle={settings.isDarkMode ? 'light-content' : 'dark-content'}
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
