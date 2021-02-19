import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  ProgramScreen,
  ArticleScreen,
  ChannelScreen,
  MainScreen,
  SettingsScreen,
  CommentsScreen,
  SlugScreen,
  SearchScreen,
  GalleryScreen,
  HistoryScreen,
  BookmarksScreen,
  CustomPageScreen,
  WebPageScreen,
  WeatherScreen,
} from '../screens';
import {Platform} from 'react-native';
import {Drawer, SearchFilterDrawer} from '../components';
import {useSettings} from '../settings/useSettings';
import {themeDark, themeLight} from '../Theme';

const Stack = createStackNavigator();
const MainDrawer = createDrawerNavigator();
const SearchDrawer = createDrawerNavigator();

export default () => {
  const settings = useSettings();

  const MainDrawerNavigator = () => {
    return (
      <MainDrawer.Navigator drawerContent={(props) => <Drawer {...props} />}>
        <MainDrawer.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        />
      </MainDrawer.Navigator>
    );
  };

  const SearchDrawerNavigator = () => {
    return (
      <SearchDrawer.Navigator
        backBehavior="initialRoute"
        drawerPosition="right"
        drawerType="slide"
        hideStatusBar={false}
        drawerContent={() => <SearchFilterDrawer />}>
        <SearchDrawer.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{
            headerShown: true,
          }}
        />
      </SearchDrawer.Navigator>
    );
  };

  const theme = settings.isDarkMode ? themeDark : themeLight;

  return (
    <Stack.Navigator
      headerMode={Platform.OS === 'android' ? 'screen' : 'float'}
      mode="card"
      screenOptions={{
        cardShadowEnabled: false,
        headerBackTitleVisible: false,
        headerRightContainerStyle: {paddingEnd: 4},
        headerTitle: '',
        headerTitleStyle: {
          color: theme.colors.headerTint,
          fontFamily: 'SourceSansPro-SemiBold',
          fontSize: 16,
        },
        headerTintColor: theme.colors.headerTint,
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
      }}>
      <Stack.Screen
        name="Home"
        component={MainDrawerNavigator}
        options={{
          headerShown: false,
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
      <Stack.Screen name="Search" component={SearchDrawerNavigator} options={{headerShown: false}} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Program" component={ProgramScreen} />
      <Stack.Screen name="Slug" component={SlugScreen} />
      <Stack.Screen name="Page" component={CustomPageScreen} />
      <Stack.Screen name="WebPage" component={WebPageScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
    </Stack.Navigator>
  );
};
