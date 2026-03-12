// Setup RN Gesture handler
import 'react-native-gesture-handler';

import {setupGemius} from './app/util/useGemiusSetup';
setupGemius();

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
// globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE === true;

// Eagerly initialize Firestore to avoid race condition where concurrent
// calls to getFirestore() both try to set settings on the same instance.
// See: https://github.com/invertase/react-native-firebase/issues/7496
import {getFirestore} from '@react-native-firebase/firestore';
getFirestore();

import App from './App';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
