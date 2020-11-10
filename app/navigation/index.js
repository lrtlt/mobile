/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, Platform, TextInput} from 'react-native';
import {useSelector} from 'react-redux';
import {BorderlessButton} from 'react-native-gesture-handler';
import {Drawer, SearchFilterDrawer, ActionButton, HeaderTitle} from '../components';
import {FilterIcon, SearchIcon} from '../components/svg';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Logo, SettingsIcon} from '../components/svg';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
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
const SearchDrawer = createDrawerNavigator();

const NavigatorComponent = () => {
  const isNavigationReady = useSelector(selectNavigationIsReady);

  if (!isNavigationReady) {
    return <Splash />;
  } else {
    const MainDrawerNavigator = () => {
      return (
        <MainDrawer.Navigator drawerContent={(props) => <Drawer {...props} />}>
          <MainDrawer.Screen name="Main" component={MainScreen} />
        </MainDrawer.Navigator>
      );
    };

    const SearchDrawerNavigator = () => {
      return (
        <SearchDrawer.Navigator
          backBehavior="initialRoute"
          openByDefault={true}
          drawerPosition="right"
          drawerType="front"
          hideStatusBar={false}
          drawerContent={() => <SearchFilterDrawer />}>
          <SearchDrawer.Screen name="SearchScreen" component={SearchScreen} />
        </SearchDrawer.Navigator>
      );
    };

    return (
      <NavigationContainer>
        <Stack.Navigator
          headerMode={Platform.OS === 'android' ? 'screen' : 'float'}
          mode="card"
          screenOptions={{
            cardShadowEnabled: false,
            headerBackTitleVisible: false,
            headerRightContainerStyle: {paddingEnd: 4},
            headerTitle: '',
            headerTintColor: EStyleSheet.value('$headerTintColor'),
            headerStyle: {
              backgroundColor: EStyleSheet.value('$appBarBackground'),
            },
          }}>
          <Stack.Screen
            name="Home"
            component={MainDrawerNavigator}
            options={({route, navigation}) => {
              return {
                headerLeft: (_) => (
                  <ActionButton onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <MaterialIcon
                      name="menu"
                      size={EStyleSheet.value('$navBarIconSize') - 2}
                      color={EStyleSheet.value('$headerTintColor')}
                    />
                  </ActionButton>
                ),
                headerRight: (_) => (
                  <ActionButton onPress={() => navigation.navigate('Settings')}>
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
                    }}>
                    <View style={{paddingStart: 12, paddingEnd: 12}}>
                      <Logo size={EStyleSheet.value('$navBarIconSize')} />
                    </View>
                  </BorderlessButton>
                ),
              };
            }}
          />
          <Stack.Screen name="Article" component={ArticleScreen} />
          <Stack.Screen name="Comments" component={CommentsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="Gallery"
            component={GalleryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Channel" component={ChannelScreen} />
          <Stack.Screen name="Search" component={SearchDrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default NavigatorComponent;
