import React from 'react';
import {View, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import {Logo, Text, TouchableDebounce} from '../../components';
import {strings, themeDark, themeLight} from '../../Theme';
import {useSettingsStore} from '../../state/settings_store';
import {useNavigationStore} from '../../state/navigation_store';

interface Props {
  onRetry: () => void;
}

/**
 * Shown when the initial bootstrap (menu + home fetch) fails. The native bootsplash is
 * already hidden by the time this mounts, so it owns both the error UI and the spinner
 * shown while a retry is in flight (see NavigatorComponent gating).
 */
const BootstrapErrorScreen: React.FC<Props> = ({onRetry}) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const {colors} = isDarkMode ? themeDark : themeLight;

  const isError = useNavigationStore((state) => state.isError);
  const {setOfflineMode} = useNavigationStore.getState();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={{...styles.container, backgroundColor: colors.background}}>
        <Logo width={80} height={80} />
        {!isError ? (
          <ActivityIndicator style={styles.loader} size="large" color={colors.buttonContent} />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText} type="error">
              {strings.error_no_connection}
            </Text>
            <TouchableDebounce onPress={onRetry}>
              <View style={{backgroundColor: colors.primary, ...styles.myButton}}>
                <Text style={{color: colors.onPrimary}}>{strings.tryAgain}</Text>
              </View>
            </TouchableDebounce>
            <TouchableDebounce onPress={() => setOfflineMode(true)}>
              <View style={{backgroundColor: colors.lightGreyBackground, ...styles.myButton}}>
                <Text style={{color: themeLight.colors.text}}>{strings.savedArticles}</Text>
              </View>
            </TouchableDebounce>
          </View>
        )}
      </View>
    </>
  );
};

export default BootstrapErrorScreen;

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
  myButton: {padding: 12, borderRadius: 6, alignItems: 'center'},
});
