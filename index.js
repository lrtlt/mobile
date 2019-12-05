import 'react-native-gesture-handler';

import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { store, persistor } from './app/redux/store';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings(['componentWillMount is deprecated', 'componentWillReceiveProps']);

const deep_linking_url_prefix = 'lrt://';

const reduxProvider = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App uriPrefix={deep_linking_url_prefix} />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => reduxProvider);
