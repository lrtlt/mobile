// Setup RN Gesture handler
import 'react-native-gesture-handler';

import {setupGemius} from './app/util/useGemiusSetup';
setupGemius();

import {setupTrackPlayer} from './app/car/useTrackPlayerSetup';

// Setup CarPlay
if (Platform.OS === 'ios') {
  require('./app/car/CarPlay');
}

import App from './App';
import {AppRegistry, Platform} from 'react-native';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './PlaybackService';

if (Platform.OS === 'android') {
  AppRegistry.registerComponent(appName, () => App);
  setupTrackPlayer();
} else {
  AppRegistry.registerComponent(appName, () => App);
}

TrackPlayer.registerPlaybackService(() => PlaybackService);
