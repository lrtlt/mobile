import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, Button, StatusBar} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Logo} from '../../components/svg';
import Styles from './styles';
import {fetchArticles, fetchMenuItems, setSelectedCategory} from '../../redux/actions';

import EStyleSheet from 'react-native-extended-stylesheet';
import OneSignal from 'react-native-onesignal';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {selectSplashScreenState} from '../../redux/selectors';

const onNotificationOpened = (openResult) => {
  console.log('Message: ', openResult.notification.payload.body);
  console.log('Data: ', openResult.notification.payload.additionalData);
  console.log('isActive: ', openResult.notification.isAppInFocus);
  console.log('openResult: ', openResult);
};

const SplashScreenComponent = (props) => {
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
      <View style={Styles.errorContainer}>
        <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
        <Button
          title={EStyleSheet.value('$tryAgain')}
          color={EStyleSheet.value('$primary')}
          onPress={() => load(true)}
        />
      </View>
    );
  };

  return (
    <>
      <StatusBar />
      <View style={Styles.container}>
        <Logo size={100} />
        <ActivityIndicator
          style={Styles.loader}
          size="large"
          animating={state.isReady !== true && state.isError === false}
          color={EStyleSheet.value('$buttonContentColor')}
        />
        {state.isError && renderError()}
      </View>
    </>
  );
};

export default SplashScreenComponent;
