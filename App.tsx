import React from 'react';
import Navigation from './app/navigation';

import AppBackground from './app/components/appBackground/AppBackground';
import {initialWindowMetrics, SafeAreaProvider} from 'react-native-safe-area-context';
import useAppTrackingPermission from './app/util/useAppTrackingPermission';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import PlayerProvider from './app/components/videoComponent/context/PlayerProvider';
import useNotificationsPermission from './app/util/useNotificationsPermission';
import useGoogleAnalyticsSetup from './app/util/useGoogleAnalyticsSetup';
import ThemeProvider from './app/theme/ThemeProvider';
import useAppCheckSetup from './app/util/useAppCheckSetup';
import {Auth0Provider} from 'react-native-auth0';

import {enableFreeze} from 'react-native-screens';
import useAuthInterceptor from './app/util/useAuthInterceptor';

enableFreeze(true);

const App: React.FC = () => {
  useAppCheckSetup();
  useNotificationsPermission();
  useAppTrackingPermission();
  useGoogleAnalyticsSetup();
  useAuthInterceptor();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <AppBackground>
          <PlayerProvider>
            <Navigation />
          </PlayerProvider>
        </AppBackground>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default () => (
  <GestureHandlerRootView style={styles.flex}>
    <Auth0Provider domain={'dev-lrt.eu.auth0.com'} clientId={'rhwPI1fTnayadAII1lKBM7pZVCRLwTbE'}>
      <App />
    </Auth0Provider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
