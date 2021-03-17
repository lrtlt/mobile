import React, {useEffect} from 'react';
import {View, ActivityIndicator, Button, StyleSheet, StatusBar} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Logo} from '../../components/svg';
import {fetchHome, fetchMenuItems} from '../../redux/actions';

import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {selectSplashScreenState} from '../../redux/selectors';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {useSettings} from '../../settings/useSettings';

const SplashScreen = (_) => {
  const {isDarkMode} = useSettings();
  const {colors, strings} = useTheme();

  const state = useSelector(selectSplashScreenState);
  const dispatch = useDispatch();

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'splash'});
  }, []);

  useEffect(() => {
    if (state.isReady !== true) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasMenuData]);

  const load = (ignoreError = false) => {
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
  };

  const renderError = () => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={() => load(true)} />
      </View>
    );
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={{...styles.container, backgroundColor: colors.background}}>
        <Logo size={100} />
        <ActivityIndicator
          style={styles.loader}
          size="large"
          animating={state.isReady !== true && state.isError === false}
          color={colors.buttonContent}
        />
        {state.isError && renderError()}
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
    fontFamily: 'SourceSansPro-Regular',
    marginBottom: 20,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 24,
    width: '50%',
  },
});
