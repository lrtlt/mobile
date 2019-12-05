import React from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { StatusBar } from '../../components';
import { Logo } from '../../components/svg';
import Styles from './styles';
import { fetchArticles, fetchMenuItems, setSelectedCategory } from '../../redux/actions';
import { connect } from 'react-redux';

import EStyleSheet from 'react-native-extended-stylesheet';
import OneSignal from 'react-native-onesignal';
import { StackActions } from 'react-navigation';
import Gemius from 'react-native-gemius-plugin';
import { GEMIUS_VIEW_SCRIPT_ID } from '../../constants';

class SplashScreen extends React.PureComponent {
  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, { screen: 'splash' });
    OneSignal.addEventListener('opened', this.onOpened);

    if (this.props.isReady !== true) {
      this.load();
    } else {
      this.navigateToHome();
    }
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  onOpened = openResult => {
    //console.log('Message: ', openResult.notification.payload.body);
    //console.log('Data: ', openResult.notification.payload.additionalData);
    //console.log('isActive: ', openResult.notification.isAppInFocus);
    //console.log('openResult: ', openResult);
  };

  navigateToHome() {
    //console.log('Replacing Splash with Home screen...');

    //Set home tab selected
    this.props.dispatch(setSelectedCategory(0));

    const replaceAciton = StackActions.replace({
      key: 'splash',
      newKey: 'home',
      routeName: 'home',
    });
    this.props.navigation.dispatch(replaceAciton);
  }

  componentDidUpdate() {
    if (this.props.isReady) {
      this.navigateToHome();
    } else {
      this.load();
    }
  }

  load(ignoreError = false) {
    if (this.props.isError && ignoreError === false) {
      return;
    }

    if (this.props.isLoading !== true) {
      if (this.props.hasMenuData) {
        //console.log('Fetching articles...');
        setTimeout(() => this.props.dispatch(fetchArticles()), 100);
      } else {
        //console.log('Fetching menu items...');
        setTimeout(() => this.props.dispatch(fetchMenuItems()), 100);
      }
    }
  }

  render() {
    const error =
      this.props.isError === true ? (
        <View style={Styles.errorContainer}>
          <Text style={Styles.errorText}>{EStyleSheet.value('$error_no_connection')}</Text>
          <Button
            title={EStyleSheet.value('$tryAgain')}
            color={EStyleSheet.value('$primary')}
            onPress={() => this.load(true)}
          />
        </View>
      ) : null;

    return (
      <View style={Styles.container}>
        <StatusBar />
        <Logo size={100} />
        <ActivityIndicator
          style={Styles.loader}
          size="large"
          animating={this.props.isReady !== true && this.props.isError === false}
          color={EStyleSheet.value('$buttonContentColor')}
        />
        {error}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.navigation.isLoading,
    isError: state.navigation.isError,
    isReady: state.navigation.isReady,
    hasMenuData: state.navigation.routes.length !== 0,
  };
};

export default connect(mapStateToProps)(SplashScreen);
