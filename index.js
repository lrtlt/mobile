// Setup RN Gesture handler
import 'react-native-gesture-handler';
// Setup CarPlay
import './app/car/CarPlay';

import App from './App';
import {AppRegistry, Platform} from 'react-native';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './PlaybackService';

// import {AndroidAutoModule} from './AndroidAuto';

if (Platform.OS === 'android') {
  // AppRegistry.registerRunnable('AndroidAuto', AndroidAutoModule);
  AppRegistry.registerComponent(appName, () => App);
} else {
  AppRegistry.registerComponent(appName, () => App);
  TrackPlayer.registerPlaybackService(() => PlaybackService);
}
