import 'react-native-gesture-handler';

import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './App';
import {store, persistor} from './app/redux/store';
import {name as appName} from './app.json';
import {SafeAreaProvider, initialWindowMetrics} from 'react-native-safe-area-context';

const reduxProvider = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <App />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => reduxProvider);
