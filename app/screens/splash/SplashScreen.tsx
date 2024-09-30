import React from 'react';
import {View, ActivityIndicator, Button, StyleSheet, StatusBar} from 'react-native';
import {Logo, Text} from '../../components';
import {strings, themeDark, themeLight} from '../../Theme';
import useSplashScreenState from './useSplashScreenState';
import {useSettingsStore} from '../../state/settings_store';

const SplashScreen: React.FC<React.PropsWithChildren<{}>> = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const {colors} = isDarkMode ? themeDark : themeLight;

  const state = useSplashScreenState();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={{...styles.container, backgroundColor: colors.background}}>
        <Logo width={120} height={120} />
        <ActivityIndicator
          style={styles.loader}
          size="large"
          animating={state.isReady !== true && state.isError === false}
          color={colors.buttonContent}
        />
        {state.isError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText} type="error">
              {strings.error_no_connection}
            </Text>
            <Button title={strings.tryAgain} color={colors.primary} onPress={() => state.load(true)} />
          </View>
        )}
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '20%',
  },
  loader: {
    position: 'absolute',
    bottom: '20%',
  },
  errorText: {
    marginTop: 40,

    marginBottom: 20,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 24,
    width: '50%',
  },
});
