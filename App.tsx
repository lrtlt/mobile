import React, {useEffect} from 'react';
import Navigation from './app/navigation';

import AppBackground from './app/components/appBackground/AppBackground';
import {initialWindowMetrics, SafeAreaProvider} from 'react-native-safe-area-context';
import useAppTrackingPermission from './app/util/useAppTrackingPermission';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Platform, StyleSheet} from 'react-native';
import PlayerProvider from './app/components/videoComponent/context/PlayerProvider';
import useNotificationsPermission from './app/util/useNotificationsPermission';
import useGoogleAnalyticsSetup from './app/util/useGoogleAnalyticsSetup';
import ThemeProvider from './app/theme/ThemeProvider';
import useAppCheckSetup from './app/util/useAppCheckSetup';
import Orientation from 'react-native-orientation-locker';

import {enableFreeze} from 'react-native-screens';
import {runArticleStorageMigration} from './app/state/article_storage_store';
import {runOnboardingStorageMigration} from './app/screens/main/useOnboardingLogic';
import {runFirebaseTopicSubsriptionMigration} from './app/util/useFirebaseTopicSubscription';
import {runSettingsStorageMigration} from './app/state/settings_store';
import {TestScreen} from './app/screens';
enableFreeze(true);

const App: React.FC = () => {
  if (Platform.OS === 'android') {
    Orientation.lockToPortrait();
  }

  useEffect(() => {
    runFirebaseTopicSubsriptionMigration();
    runOnboardingStorageMigration();
    runArticleStorageMigration();
    runSettingsStorageMigration();
  }, []);

  useAppCheckSetup();
  useNotificationsPermission();
  useAppTrackingPermission();
  useGoogleAnalyticsSetup();

  return (
    <ThemeProvider>
      <AppBackground>
        <TestScreen />
      </AppBackground>
    </ThemeProvider>
  );
};

export default () => <App />;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
