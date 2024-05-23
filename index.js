import 'react-native-gesture-handler';

import App from './App';
import {AppRegistry, Platform} from 'react-native';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './PlaybackService';

import {render} from 'react-native-android-auto';
import AndroidAutoRoot from './app/car/androidAuto/AndroidAuto';

if (Platform.OS === 'android') {
  AppRegistry.registerRunnable('androidAuto', () => {
    render(React.createElement(AndroidAutoRoot));
  });
  AppRegistry.registerComponent(appName, () => App);
} else {
  AppRegistry.registerComponent(appName, () => App);
  TrackPlayer.registerPlaybackService(() => PlaybackService);
}
