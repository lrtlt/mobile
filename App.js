import React from 'react';
import { View } from 'react-native';
import { initTheme } from './app/ColorTheme';
import { store } from './app/redux/store';
import OneSignal from 'react-native-onesignal';
import { version as appVersion } from './package.json';
import Navigation from './app/navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  ONE_SIGNAL_APP_ID,
  GEMIUS_APP_NAME,
  GEMIUS_VIEW_SCRIPT_ID,
  GEMIUS_HIT_COLLECTOR_HOST,
} from './app/constants';
import Gemius from 'react-native-gemius-plugin';

class App extends React.Component {
  constructor(props) {
    super(props);
    initTheme(store.getState().config);

    OneSignal.init(ONE_SIGNAL_APP_ID);
    OneSignal.inFocusDisplaying(2);

    OneSignal.addEventListener('ids', this.onIds);

    Gemius.setAppInfo(GEMIUS_APP_NAME, appVersion, GEMIUS_HIT_COLLECTOR_HOST, GEMIUS_VIEW_SCRIPT_ID);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onIds(device) {
    //console.log('OneSignal device info: ', device);
  }

  render() {
    return (
      <View style={style.container}>
        <Navigation />
      </View>
    );
  }
}

const style = EStyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
