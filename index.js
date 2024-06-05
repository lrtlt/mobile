import 'react-native-gesture-handler';

import {createElement} from 'react';
import App from './App';
import {AppRegistry, Platform} from 'react-native';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './PlaybackService';

import {render} from 'react-native-android-auto/src';
import {AndroidAutoRoot} from './app/car/androidAuto/AndroidAuto';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'android') {
  AppRegistry.registerRunnable('androidAuto', async () => {
    console.log('# running android auto...');
    render(createElement(AndroidAutoRoot));
  });
}

TrackPlayer.registerPlaybackService(() => PlaybackService);
