import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import * as Screens from '../screens';
import {Platform} from 'react-native';
import {Drawer, SearchFilterDrawer} from '../components';
import {useSettings} from '../settings/useSettings';
import {themeDark, themeLight} from '../Theme';
import {ArticlePhotoType, MenuItemPage, SearchFilter} from '../api/Types';
import {NavigatorScreenParams} from '@react-navigation/native';
import SearchContextProvider from '../screens/search/context/SearchContextProvider';
import SettingsScreenView from '../screens/settings/SettingsScreenView';

export type MainStackParamList = {
  Home: undefined;
  Settings: undefined;
  Article: {
    articleId: number;
  };
  Comments: {
    url: string;
  };
  Gallery: {
    images: ArticlePhotoType[];
    selectedImage: ArticlePhotoType;
  };
  Channel: {
    channelId: number;
  };
  Search: NavigatorScreenParams<SearchDrawerParamList>;
  Bookmarks: undefined;
  History: undefined;
  Program: undefined;
  Slug: {
    name: string;
    slugUrl?: string;
  };
  Page: {
    page: MenuItemPage;
  };
  WebPage: {
    url: string;
    title: string;
  };
  Weather: undefined;
  Category: {
    id: number;
    name: string;
  };
};

const Stack = createStackNavigator<MainStackParamList>();

export type MainDrawerParamList = {
  Main: undefined;
};
const MainDrawer = createDrawerNavigator<MainDrawerParamList>();

const MainDrawerNavigator: React.FC = () => {
  return (
    <MainDrawer.Navigator drawerContent={(props) => <Drawer {...props} />}>
      <MainDrawer.Screen
        name="Main"
        component={Screens.MainScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
    </MainDrawer.Navigator>
  );
};

export type MainWithSettingsDrawerParamList = {
  Main: undefined;
};

const MainWithSettingsDrawer = createDrawerNavigator<MainWithSettingsDrawerParamList>();

const MainSettingsDrawerNavigator: React.FC = () => {
  return (
    <MainWithSettingsDrawer.Navigator
      drawerContent={(_props) => <SettingsScreenView />}
      drawerPosition="right"
      drawerType="slide">
      <MainWithSettingsDrawer.Screen name="Main" component={MainDrawerNavigator} />
    </MainWithSettingsDrawer.Navigator>
  );
};

export type SearchDrawerParamList = {
  SearchScreen: {
    q?: string;
    filter?: SearchFilter;
  };
};

const SearchDrawer = createDrawerNavigator<SearchDrawerParamList>();

const SearchDrawerNavigator: React.FC = () => {
  return (
    <SearchContextProvider>
      <SearchDrawer.Navigator
        backBehavior="initialRoute"
        drawerPosition="right"
        drawerType="slide"
        hideStatusBar={false}
        drawerContent={() => <SearchFilterDrawer />}>
        <SearchDrawer.Screen
          name="SearchScreen"
          component={Screens.SearchScreen}
          options={{
            headerShown: true,
          }}
        />
      </SearchDrawer.Navigator>
    </SearchContextProvider>
  );
};

export default () => {
  const settings = useSettings();

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
        component={MainSettingsDrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Article" component={Screens.ArticleScreen} />
      <Stack.Screen name="Comments" component={Screens.CommentsScreen} />
      <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
      <Stack.Screen
        name="Gallery"
        component={Screens.GalleryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Channel" component={Screens.ChannelScreen} />
      <Stack.Screen name="Search" component={SearchDrawerNavigator} options={{headerShown: false}} />
      <Stack.Screen name="Bookmarks" component={Screens.BookmarksScreen} />
      <Stack.Screen name="History" component={Screens.HistoryScreen} />
      <Stack.Screen name="Program" component={Screens.ProgramScreen} />
      <Stack.Screen name="Slug" component={Screens.SlugScreen} />
      <Stack.Screen name="Page" component={Screens.CustomPageScreen} />
      <Stack.Screen name="WebPage" component={Screens.WebPageScreen} />
      <Stack.Screen name="Weather" component={Screens.WeatherScreen} />
      <Stack.Screen name="Category" component={Screens.CategoryScreen} />
    </Stack.Navigator>
  );
};
