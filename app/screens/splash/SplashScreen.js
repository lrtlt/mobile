import React, {useEffect} from 'react';
import {View, ActivityIndicator, Button, StatusBar, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Logo} from '../../components/svg';
import {fetchArticles, fetchMenuItems, setSelectedCategory} from '../../redux/actions';

import OneSignal from 'react-native-onesignal';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {selectSplashScreenState} from '../../redux/selectors';
import {Text} from '../../components';
import {useTheme} from '../../Theme';

const onNotificationOpened = (openResult) => {
  console.log('Message: ', openResult.notification.payload.body);
  console.log('Data: ', openResult.notification.payload.additionalData);
  console.log('isActive: ', openResult.notification.isAppInFocus);
  console.log('openResult: ', openResult);
};

const SplashScreenComponent = (_) => {
  const {colors, strings} = useTheme();

  const state = useSelector(selectSplashScreenState);
  const dispatch = useDispatch();

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'splash'});
    OneSignal.addEventListener('opened', onNotificationOpened);
    return () => {
      OneSignal.removeEventListener('opened', onNotificationOpened);
    };
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
        dispatch(setSelectedCategory(0));
        dispatch(fetchArticles());
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
      <StatusBar />
      <View style={styles.container}>
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

export default SplashScreenComponent;

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
