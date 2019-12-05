import { NativeModules, Platform } from 'react-native';

const { GemiusPlugin } = NativeModules;

export default class Gemius {
  static setAppInfo(app, version, gemiusHitCollectorHost, gemiusPrismIdentifier) {
    GemiusPlugin.setAppInfo(app, version, gemiusHitCollectorHost, gemiusPrismIdentifier);
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
