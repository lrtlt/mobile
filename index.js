import 'react-native-gesture-handler';

import App from './App';
import {AppRegistry, Platform} from 'react-native';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './PlaybackService';

import {AndroidAuto, AndroidAutoModule} from './AndroidAuto';

if (Platform.OS === 'android') {
  AppRegistry.registerRunnable('AndroidAuto', AndroidAutoModule);
  AppRegistry.registerComponent(appName, () => AndroidAuto);
} else {
  AppRegistry.registerComponent(appName, () => App);
  TrackPlayer.registerPlaybackService(() => PlaybackService);
}
