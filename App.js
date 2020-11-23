import React from 'react';
import {View, Platform, StyleSheet} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {version as appVersion} from './package.json';
import Navigation from './app/navigation';

import {
  ONE_SIGNAL_APP_ID,
  GEMIUS_APP_NAME,
  GEMIUS_VIEW_SCRIPT_ID,
  GEMIUS_HIT_COLLECTOR_HOST,
  GEMIUS_PLAYER_SCRIPT_ID,
} from './app/constants';
import Gemius from 'react-native-gemius-plugin';
import SettingsProvider from './app/settings/SettingsProvider';
import AppBackground from './app/components/appBackground/AppBackground';

class App extends React.Component {
  constructor(props) {
    super(props);

    OneSignal.init(ONE_SIGNAL_APP_ID);
    OneSignal.inFocusDisplaying(2);

    OneSignal.addEventListener('ids', this.onIds);

    Gemius.setAppInfo(GEMIUS_APP_NAME, appVersion, GEMIUS_HIT_COLLECTOR_HOST, GEMIUS_VIEW_SCRIPT_ID);

    const playerId = 'lrt-player-' + Platform.OS;
    Gemius.setPlayerInfo(playerId, GEMIUS_HIT_COLLECTOR_HOST, GEMIUS_PLAYER_SCRIPT_ID);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onIds(device) {
    console.log('OneSignal device info: ', device);
  }

  render() {
    return (
      <View style={style.container}>
        <SettingsProvider>
          <AppBackground>
            <Navigation />
          </AppBackground>
        </SettingsProvider>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
