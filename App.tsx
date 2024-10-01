import React, {useEffect} from 'react';
import Navigation from './app/navigation';

import AppBackground from './app/components/appBackground/AppBackground';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {initialWindowMetrics, SafeAreaProvider} from 'react-native-safe-area-context';
import {persistor, store} from './app/redux/store';
import useAppTrackingPermission from './app/util/useAppTrackingPermission';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Platform, StyleSheet} from 'react-native';
import PlayerProvider from './app/components/videoComponent/context/PlayerProvider';
import useNotificationsPermission from './app/util/useNotificationsPermission';
import useGoogleAnalyticsSetup from './app/util/useGoogleAnalyticsSetup';
import ThemeProvider from './app/theme/ThemeProvider';
import useAppCheckSetup from './app/util/useAppCheckSetup';
import Orientation from 'react-native-orientation-locker';

import {enableFreeze} from 'react-native-screens';
import {runArticleStorageMigration} from './app/state/article_storage_store';
enableFreeze(true);

const ReduxProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

const App: React.FC = () => {
  if (Platform.OS === 'android') {
    Orientation.lockToPortrait();
  }

  useEffect(() => {
    runArticleStorageMigration();
  }, []);

  useAppCheckSetup();
  useNotificationsPermission();
  useAppTrackingPermission();
  useGoogleAnalyticsSetup();

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
    <ReduxProvider>
      <App />
    </ReduxProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
