import {Platform} from 'react-native';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_HIT_COLLECTOR_HOST} from '../constants';
import Config from 'react-native-config';

export const setupGemius = () => {
  const appVersion = require('../../package.json').version;

  Gemius.setAppInfo(
    Config.GEMIUS_APP_NAME,
    appVersion,
    GEMIUS_HIT_COLLECTOR_HOST,
    Config.GEMIUS_VIEW_SCRIPT_ID,
  );

  const playerId = 'lrt-player-' + Platform.OS;
  Gemius.setPlayerInfo(playerId, GEMIUS_HIT_COLLECTOR_HOST, Config.GEMIUS_PLAYER_SCRIPT_ID);
};
