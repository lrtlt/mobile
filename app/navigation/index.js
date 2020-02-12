/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { View, Platform, TextInput } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Drawer, SearchFilterDrawer, ActionButton, HeaderTitle } from '../components';
import { FilterIcon, SearchIcon } from '../components/svg';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Logo, SettingsIcon } from '../components/svg';
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
} from '../screens';

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import EStyleSheet from 'react-native-extended-stylesheet';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_LOGO_PRESS } from '../constants';

import styles from './styles';

const mainDrawerNavigator = createDrawerNavigator(
  {
    mainScreen: {
      screen: MainScreen,
    },
  },
  {
    hideStatusBar: false,
    drawerType: Platform.OS === 'ios' ? 'slide' : 'front',
    backBehavior: 'initialRoute',
    overlayColor: '#00000090',
    contentComponent: Drawer,
  },
);

const searchDrawerNavigator = createDrawerNavigator(
  {
    searchScreen: {
      screen: SearchScreen,
    },
  },
  {
    hideStatusBar: false,
    drawerType: 'front',
    drawerPosition: 'right',
    backBehavior: 'initialRoute',
    overlayColor: '#00000090',
    contentComponent: SearchFilterDrawer,
  },
);

const StackNavigator = createStackNavigator(
  {
    splash: {
      screen: Splash,
      navigationOptions: {
        headerShown: false,
      },
    },
    home: {
      screen: mainDrawerNavigator,
      navigationOptions: ({ navigation }) => ({
        headerShown: true,
        headerLeft: (
          <ActionButton onPress={() => navigation.toggleDrawer()}>
            <MaterialIcon
              name="menu"
              size={EStyleSheet.value('$navBarIconSize') - 2}
              color={EStyleSheet.value('$headerTintColor')}
            />
          </ActionButton>
        ),

        headerRight: (
          <ActionButton onPress={() => navigation.navigate('settings')}>
            <SettingsIcon
              size={EStyleSheet.value('$navBarIconSize') - 2}
              color={EStyleSheet.value('$headerTintColor')}
            />
          </ActionButton>
        ),
        headerTitle: (
          <BorderlessButton
            onPress={() => {
              EventRegister.emit(EVENT_LOGO_PRESS, null);
            }}
          >
            <View style={{ paddingStart: 12, paddingEnd: 12 }}>
              <Logo size={EStyleSheet.value('$navBarIconSize')} />
            </View>
          </BorderlessButton>
        ),
      }),
    },
    article: {
      screen: ArticleScreen,
      path: 'article/:articleId',
    },
    gallery: {
      screen: GalleryScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    slug: {
      screen: SlugScreen,
    },
    comments: {
      screen: CommentsScreen,
    },
    channel: {
      screen: ChannelScreen,
      path: 'channel/:channelId',
    },
    settings: {
      screen: SettingsScreen,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    program: {
      screen: ProgramScreen,
    },
    history: {
      screen: HistoryScreen,
    },
    search: {
      screen: searchDrawerNavigator,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <TextInput
            style={styles.searchInput}
            multiline={false}
            placeholder={'Paieška'}
            numberOfLines={1}
            onSubmitEditing={() => navigation.getParam('searchHandler')()}
            returnKeyType="search"
            placeholderTextColor={EStyleSheet.value('$textColorDisabled')}
            onChangeText={text => navigation.getParam('searchInputHandler')(text)}
            value={navigation.getParam('q', '')}
          />
        ),
        headerRight: (
          <View style={styles.row}>
            <ActionButton onPress={() => navigation.getParam('searchHandler')()}>
              <SearchIcon
                size={EStyleSheet.value('$navBarIconSize')}
                color={EStyleSheet.value('$headerTintColor')}
              />
            </ActionButton>
            <ActionButton onPress={() => navigation.toggleDrawer()}>
              <FilterIcon
                size={EStyleSheet.value('$navBarIconSize')}
                color={EStyleSheet.value('$headerTintColor')}
              />
            </ActionButton>
          </View>
        ),
      }),
    },
  },
  {
    initialRouteKey: 'splash',
    mode: 'card',
    cardShadowEnabled: false,
    headerLayoutPreset: 'center',
    headerMode: Platform.OS === 'android' ? 'screen' : 'float',
    defaultNavigationOptions: ({ navigation }) => ({
      headerBackTitle: null,
      headerRightContainerStyle: { paddingEnd: 4 },
      headerStatusBarHeight: Platform.OS === 'android' ? 0 : null,
      headerTitle: props => <HeaderTitle {...props} />,
      headerTintColor: EStyleSheet.value('$headerTintColor'),
      headerStyle: {
        backgroundColor: EStyleSheet.value('$appBarBackground'),
      },
    }),
  },
);

export default createAppContainer(StackNavigator);
