import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator, DrawerNavigationProp} from '@react-navigation/drawer';

import * as Screens from '../screens';
import {SearchFilterDrawer} from '../components';
import {themeDark, themeLight} from '../Theme';
import {
  ArticleContent,
  ArticlePhotoType,
  MenuItemPage,
  RadiotekaPlaylistBlock,
  SearchFilter,
} from '../api/Types';
import {NavigatorScreenParams} from '@react-navigation/native';
import SearchContextProvider from '../screens/search/context/SearchContextProvider';
import ChannelContextProvider from '../screens/channel/context/ChannelContextProvider';
import {Article} from '../../Types';
import {useSettingsStore} from '../state/settings_store';
import {Platform} from 'react-native';
import {useNavigationStore} from '../state/navigation_store';
import Drawer2Component from '../components/drawer2/Drawer2';

export type MainStackParamList = {
  Home: undefined;
  Offline: undefined;
  Settings: undefined;
  Article: {
    articleId: number;
    isMedia?: boolean;
  };
  ArticleDeepLinkProxy: MainStackParamList['Article'];
  CachedArticle: {
    article: ArticleContent;
  };
  MediaArticleDeepLinkProxy: MainStackParamList['Article'];
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
    url: string;
  };
  VideoList: {
    title: string;
    initialIndex: number;
    articles: Article[];
  };
  Podcast: {
    articleId: number;
  };
  Vodcast: {
    articleId: number;
  };
  Playlist: {
    data: RadiotekaPlaylistBlock;
  };
  Genre: {
    genreId: number;
    title: string;
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export type MainDrawerParamList = {
  Main: undefined;
};
const MainDrawer = createDrawerNavigator<MainDrawerParamList>();

const MainDrawerNavigator: React.FC<React.PropsWithChildren<{}>> = () => {
  return (
    <MainDrawer.Navigator
      screenOptions={{
        overlayAccessibilityLabel: 'Uždaryti meniu',
        freezeOnBlur: true,
      }}
      drawerContent={(props) => (
        <Drawer2Component
          navigation={props.navigation as unknown as DrawerNavigationProp<MainStackParamList>}
        />
      )}>
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

export type SearchDrawerParamList = {
  SearchScreen: {
    q?: string;
    filter?: SearchFilter;
  };
};

const SearchDrawer = createDrawerNavigator<SearchDrawerParamList>();

const SearchDrawerNavigator: React.FC<React.PropsWithChildren<{}>> = () => {
  return (
    <SearchContextProvider>
      <SearchDrawer.Navigator
        backBehavior="initialRoute"
        screenOptions={{
          overlayAccessibilityLabel: 'Uždaryti meniu',
          drawerPosition: 'right',
          drawerType: 'slide',
          drawerHideStatusBarOnOpen: false,
        }}
        drawerContent={(props) => <SearchFilterDrawer {...props} />}>
        <SearchDrawer.Screen
          name="SearchScreen"
          component={Screens.SearchScreen}
          options={{
            headerShown: false,
          }}
        />
      </SearchDrawer.Navigator>
    </SearchContextProvider>
  );
};

export default () => {
  const isOfflineMode = useNavigationStore((state) => state.isOfflineMode);
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const theme = isDarkMode ? themeDark : themeLight;

  return (
    <Stack.Navigator
      initialRouteName={isOfflineMode ? 'Offline' : 'Home'}
      screenOptions={{
        presentation: 'card',
        headerBackButtonDisplayMode: 'minimal',
        // headerBackTitleVisible: false,
        // headerRightContainerStyle: {paddingEnd: 4},
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
      <Stack.Screen name="Offline" component={Screens.OfflineScreen} />
      <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
      <Stack.Screen
        name="Article"
        component={Screens.ArticleScreen}
        options={{headerShown: false}} //We use custom header in the screen
      />
      <Stack.Screen
        name="CachedArticle"
        component={Screens.CachedArticleScreen as any}
        options={{headerShown: false}} //We use custom header in the screen
      />
      <Stack.Screen
        name="ArticleDeepLinkProxy"
        component={Screens.ArticleScreen as any}
        options={{headerShown: false}} //We use custom header in the screen
      />
      <Stack.Screen
        name="MediaArticleDeepLinkProxy"
        component={Screens.ArticleScreen as any}
        initialParams={{
          isMedia: true,
        }}
        options={{headerShown: false}} //We use custom header in the screen
      />
      <Stack.Screen name="Comments" component={Screens.CommentsScreen} />
      <Stack.Screen
        name="Gallery"
        component={Screens.GalleryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Channel">
        {(props) => (
          <ChannelContextProvider>
            <Screens.ChannelScreen {...props} />
          </ChannelContextProvider>
        )}
      </Stack.Screen>
      <Stack.Screen name="Search" component={SearchDrawerNavigator} options={{headerShown: false}} />
      <Stack.Screen name="Bookmarks" component={Screens.BookmarksScreen} />
      <Stack.Screen name="History" component={Screens.HistoryScreen} />
      <Stack.Screen name="Program" component={Screens.ProgramScreen} />
      <Stack.Screen name="Slug" component={Screens.SlugScreen} />
      <Stack.Screen name="Page" component={Screens.CustomPageScreen} />
      <Stack.Screen name="WebPage" component={Screens.WebPageScreen} />
      <Stack.Screen name="Weather" component={Screens.WeatherScreen} />
      <Stack.Screen name="Category" component={Screens.CategoryScreen} />
      <Stack.Screen
        name="Podcast"
        component={Screens.PodcastScreen}
        options={{headerShown: false}} //We use custom header in the screen
      />
      <Stack.Screen
        name="Vodcast"
        component={Screens.VodcastScreen}
        options={{headerShown: false}} //We use custom header in the screen
      />
      <Stack.Screen name="Playlist" component={Screens.PlaylistScreen} />
      <Stack.Screen name="Genre" component={Screens.GenreScreen} />
      <Stack.Screen
        name="VideoList"
        component={Screens.VerticalVideosScreen}
        options={{
          animation: 'slide_from_bottom',
          animationDuration: 200,
          presentation: Platform.select({
            android: 'transparentModal',
            ios: 'card',
          }),
        }}
      />
    </Stack.Navigator>
  );
};
