import React from 'react';
import Navigation from './app/navigation';

import SettingsProvider from './app/settings/SettingsProvider';
import AppBackground from './app/components/appBackground/AppBackground';
import useOneSignal from './app/util/useOneSignal';
import useGemiusSetup from './app/util/useGemiusSetup';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {initialWindowMetrics, SafeAreaProvider} from 'react-native-safe-area-context';
import {persistor, store} from './app/redux/store';
import useAppTrackingPermission from './app/util/useAppTrackingPermission';

const ReduxProvider: React.FC = ({children}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

const App: React.FC = () => {
  useAppTrackingPermission();
  useGemiusSetup();
  useOneSignal();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SettingsProvider>
        <AppBackground>
          <Navigation />
        </AppBackground>
      </SettingsProvider>
    </SafeAreaProvider>
  );
};

export default () => (
  <ReduxProvider>
    <App />
  </ReduxProvider>
);
