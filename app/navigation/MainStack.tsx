import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import * as Screens from '../screens';
import {Platform} from 'react-native';
import {Drawer, SearchFilterDrawer} from '../components';
import {useSettings} from '../settings/useSettings';
import {themeDark, themeLight} from '../Theme';
import {Category} from '../redux/reducers/articles';
import {ArticlePhoto, MenuItemPage} from '../api/Types';

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
    images: ArticlePhoto[];
    selectedImage: ArticlePhoto;
  };
  Channel: {
    channelId: number;
  };
  Search: undefined;
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

export type SearchDrawerParamList = {
  SearchScreen: undefined;
};

const SearchDrawer = createDrawerNavigator<SearchDrawerParamList>();

export default () => {
  const settings = useSettings();

  const MainDrawerNavigator = () => {
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
          component={Screens.SearchScreen}
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
