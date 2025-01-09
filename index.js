// Setup RN Gesture handler
import 'react-native-gesture-handler';
//Might help with crash https://github.com/jpudysz/react-native-unistyles/issues/151
import 'react-native-unistyles';

import {setupGemius} from './app/util/useGemiusSetup';
setupGemius();

import App from './App';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
