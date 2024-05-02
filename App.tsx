import React from 'react';
import Navigation from './app/navigation';

import SettingsProvider from './app/settings/SettingsProvider';
import AppBackground from './app/components/appBackground/AppBackground';
import useGemiusSetup from './app/util/useGemiusSetup';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {initialWindowMetrics, SafeAreaProvider} from 'react-native-safe-area-context';
import {persistor, store} from './app/redux/store';
import useAppTrackingPermission from './app/util/useAppTrackingPermission';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import PlayerProvider from './app/components/videoComponent/context/PlayerProvider';
import useNotificationsPermission from './app/util/useNotificationsPermission';
import useGoogleAnalyticsSetup from './app/util/useGoogleAnalyticsSetup';
import CarPlayProvider from './app/car/CarPlayProvider';
import ThemeProvider from './app/theme/ThemeProvider';

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
  useNotificationsPermission();
  useAppTrackingPermission();
  useGoogleAnalyticsSetup();
  useGemiusSetup();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SettingsProvider>
        <ThemeProvider>
          <AppBackground>
            <PlayerProvider>
              <CarPlayProvider>
                <Navigation />
              </CarPlayProvider>
            </PlayerProvider>
          </AppBackground>
        </ThemeProvider>
      </SettingsProvider>
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
