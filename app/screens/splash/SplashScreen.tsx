import React from 'react';
import {View, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import {Logo, Text, TouchableDebounce} from '../../components';
import {strings, themeDark, themeLight} from '../../Theme';
import useSplashScreenState from './useSplashScreenState';
import {useSettingsStore} from '../../state/settings_store';
import {useNavigationStore} from '../../state/navigation_store';

const SplashScreen: React.FC<React.PropsWithChildren<{}>> = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const {colors} = isDarkMode ? themeDark : themeLight;

  const state = useSplashScreenState();

  const {setOfflineMode} = useNavigationStore.getState();

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
            <TouchableDebounce onPress={() => state.load(true)}>
              <View style={{backgroundColor: colors.primary, ...styles.myButton}}>
                <Text style={{color: colors.onPrimary}}>{strings.tryAgain}</Text>
              </View>
            </TouchableDebounce>
            <TouchableDebounce onPress={() => setOfflineMode(true)}>
              <View style={{backgroundColor: colors.lightGreyBackground, ...styles.myButton}}>
                <Text style={{color: themeLight.colors.text}}>Išsaugoti strapsniai</Text>
              </View>
            </TouchableDebounce>
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
    alignItems: 'stretch',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '20%',
    minWidth: 240,
    gap: 12,
  },
  loader: {
    position: 'absolute',
    bottom: '20%',
  },
  errorText: {
    marginTop: 40,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 24,
    width: '50%',
  },
  myButton: {padding: 12, borderRadius: 6, alignItems: 'center'},
});
