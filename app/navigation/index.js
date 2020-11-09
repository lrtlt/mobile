/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, Platform, TextInput} from 'react-native';
import {useSelector} from 'react-redux';
import {BorderlessButton} from 'react-native-gesture-handler';
import {Drawer, SearchFilterDrawer, ActionButton, HeaderTitle} from '../components';
import {FilterIcon, SearchIcon} from '../components/svg';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Logo, SettingsIcon} from '../components/svg';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  ProgramScreen,
  ArticleScreen,
  ChannelScreen,
  MainScreen,
  SettingsScreen,
  Splash,
  CommentsScreen,
  SlugScreen,
  SearchScreen,
  GalleryScreen,
  HistoryScreen,
  BookmarksScreen,
  CustomPageScreen,
} from '../screens';

import EStyleSheet from 'react-native-extended-stylesheet';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_LOGO_PRESS} from '../constants';

import styles from './styles';
import {selectNavigationIsReady} from '../redux/selectors';

const Stack = createStackNavigator();
const MainDrawer = createDrawerNavigator();

const NavigatorComponent = () => {
  const isNavigationReady = useSelector(selectNavigationIsReady);

  if (!isNavigationReady) {
    return <Splash />;
  } else {
    const MainNavigator = () => {
      return (
        <MainDrawer.Navigator drawerContent={() => <Drawer />}>
          <MainDrawer.Screen name="Main" component={MainScreen} />
        </MainDrawer.Navigator>
      );
    };

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default NavigatorComponent;
