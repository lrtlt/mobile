import React, {useCallback, useEffect} from 'react';
import {View, ActivityIndicator, Button, StyleSheet, StatusBar} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchHome, fetchMenuItems} from '../../redux/actions';

import {selectSplashScreenState} from '../../redux/selectors';
import {Logo, Text} from '../../components';
import {strings, themeDark, themeLight} from '../../Theme';
import {useSettings} from '../../settings/useSettings';
import {checkEqual} from '../../util/LodashEqualityCheck';

const SplashScreen: React.FC = () => {
  const {isDarkMode} = useSettings();
  const {colors} = isDarkMode ? themeDark : themeLight;

  const state = useSelector(selectSplashScreenState, checkEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.isReady !== true) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasMenuData]);

  const load = useCallback(
    (ignoreError = false) => {
      if (state.isError && ignoreError === false) {
        return;
      }

      if (state.isLoading !== true) {
        if (state.hasMenuData) {
          dispatch(fetchHome());
        } else {
          dispatch(fetchMenuItems());
        }
      }
    },
    [dispatch, state.hasMenuData, state.isError, state.isLoading],
  );

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
            <Button title={strings.tryAgain} color={colors.primary} onPress={() => load(true)} />
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
