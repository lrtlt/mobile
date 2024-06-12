import {Platform} from 'react-native';
import Gemius from 'react-native-gemius-plugin';
import {
  GEMIUS_APP_NAME,
  GEMIUS_HIT_COLLECTOR_HOST,
  GEMIUS_PLAYER_SCRIPT_ID,
  GEMIUS_VIEW_SCRIPT_ID,
} from '../constants';

export const setupGemius = () => {
  const appVersion = require('../../package.json').version;
  console.log('App version: ', appVersion);
  Gemius.setAppInfo(GEMIUS_APP_NAME, appVersion, GEMIUS_HIT_COLLECTOR_HOST, GEMIUS_VIEW_SCRIPT_ID);

  const playerId = 'lrt-player-' + Platform.OS;
  Gemius.setPlayerInfo(playerId, GEMIUS_HIT_COLLECTOR_HOST, GEMIUS_PLAYER_SCRIPT_ID);
};
