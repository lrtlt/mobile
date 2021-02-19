import React, {useEffect} from 'react';
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
import {useDispatch} from 'react-redux';
import {openLinkingUrl} from './app/redux/actions/navigation';

const App = () => {
  const dispatch = useDispatch();

  //#region Setup OneSignal
  useEffect(() => {
    OneSignal.setAppId(ONE_SIGNAL_APP_ID);
    OneSignal.getDeviceState()
      .then((deviceState) => console.log('OneSignal device state: ', deviceState))
      .catch((e) => console.log('OneSignal device error: ', e));

    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      console.log('OneSignal: notification opened:', openedEvent);
      const {launchURL} = openedEvent.notification;
      if (launchURL) {
        dispatch(openLinkingUrl(launchURL));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Setup Gemius
  useEffect(() => {
    Gemius.setAppInfo(GEMIUS_APP_NAME, appVersion, GEMIUS_HIT_COLLECTOR_HOST, GEMIUS_VIEW_SCRIPT_ID);

    const playerId = 'lrt-player-' + Platform.OS;
    Gemius.setPlayerInfo(playerId, GEMIUS_HIT_COLLECTOR_HOST, GEMIUS_PLAYER_SCRIPT_ID);
  }, []);
  //#endregion

  return (
    <View style={style.container}>
      <SettingsProvider>
        <AppBackground>
          <Navigation />
        </AppBackground>
      </SettingsProvider>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
