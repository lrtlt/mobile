import { NativeModules, Platform } from 'react-native';

const { GemiusPlugin } = NativeModules;

const PROGRAM_TYPE_VIDEO = 'video';
const PROGRAM_TYPE_AUDIO = 'audio';

/**
 * Duration used for live streams
 */
export const DURATION_LIVE_STREAM = -1;

export default class Gemius {
  static setAppInfo(app, version, gemiusHitCollectorHost, gemiusPrismIdentifier) {
    GemiusPlugin.setAppInfo(app, version, gemiusHitCollectorHost, gemiusPrismIdentifier);
  }

  static setPlayerInfo(playerId, serverHost, accountId) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.setPlayerInfo(playerId, serverHost, accountId);
  }

  static setProgramData(clipId, name, duration, isVideo) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    const type = isVideo === true ? PROGRAM_TYPE_VIDEO : PROGRAM_TYPE_AUDIO;
    GemiusPlugin.setProgramData(clipId, name, duration, type);
  }

  static sendPlay(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendPlay(clipId, offset);
  }

  static sendPause(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendPause(clipId, offset);
  }

  static sendBuffer(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendBuffer(clipId, offset);
  }

  static sendStop(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendStop(clipId, offset);
  }

  static sendComplete(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendComplete(clipId, offset);
  }

  static sendClose(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendClose(clipId, offset);
  }

  static sendSeek(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendSeek(clipId, offset);
  }

  static sendComplete(clipId, offset) {
    if (Platform.OS === 'ios') {
      //No implementation for iOS yet.
      return;
    }
    GemiusPlugin.sendComplete(clipId, offset);
  }

  static sendPartialPageViewedEvent(gemiusPrismIdentifier, extraParameters = null) {
    GemiusPlugin.sendPartialPageViewedEvent(gemiusPrismIdentifier, extraParameters);
  }

  static sendPageViewedEvent(gemiusPrismIdentifier, extraParameters = null) {
    GemiusPlugin.sendPageViewedEvent(gemiusPrismIdentifier, extraParameters);
  }

  static sendActionEvent(gemiusPrismIdentifier, extraParameters = null) {
    GemiusPlugin.sendActionEvent(gemiusPrismIdentifier, extraParameters);
  }
}
