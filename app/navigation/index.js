import React, {useRef} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {Drawer, SearchFilterDrawer} from '../components';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SplashViewComponent from '../screens/splash/SplashScreenView';

import crashlytics from '@react-native-firebase/crashlytics';

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
  WebPageScreen,
} from '../screens';

import {selectNavigationIsReady} from '../redux/selectors';
import {themeDark, themeLight} from '../Theme';
import {useSettings} from '../settings/useSettings';
import {DEEP_LINKING_URL_PREFIX, GEMIUS_VIEW_SCRIPT_ID} from '../constants';
import WeatherScreen from '../screens/weather/WeatherScreen';
import Gemius from '../../react-native-gemius-plugin';

const Stack = createStackNavigator();
const MainDrawer = createDrawerNavigator();
const SearchDrawer = createDrawerNavigator();

const linking = {
  prefixes: [DEEP_LINKING_URL_PREFIX],
  config: {
    initialRouteName: 'Home',
    screens: {
      Article: {
        path: 'article/:articleId',
      },
      Channel: {
        path: 'channel/:channelId',
      },
    },
  },
};

const NavigatorComponent = () => {
  const isNavigationReady = useSelector(selectNavigationIsReady);

  const settings = useSettings();
  console.log('SETTINGS', settings);

  const routeNameRef = useRef();
  const navRef = useRef(null);

  const onNavigationReady = () => {
    routeNameRef.current = navRef.current?.getCurrentRoute()?.name;
  };

  const onNavigationStateChange = () => {
    const currentRoute = navRef.current?.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    if (currentRouteName && routeNameRef.current !== currentRouteName) {
      const currentScreen = currentRouteName.toLowerCase();
      const params = {
        screen: currentScreen,
        params: JSON.stringify(currentRoute.params),
      };
      //console.log('Current screen: ', params);
      crashlytics().log(`Current screen: ${currentScreen}\n Params:\n${JSON.stringify(params)}`);
      Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, params);
    }
    routeNameRef.current = currentRouteName;
  };

  if (!isNavigationReady) {
    return <Splash />;
  } else {
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
      <>
        <StatusBar
          barStyle={settings.isDarkMode ? 'light-content' : 'dark-content'}
          translucent={false}
          backgroundColor={theme.colors.statusBar}
        />
        <NavigationContainer
          ref={navRef}
          theme={theme}
          linking={linking}
          fallback={<SplashViewComponent />}
          onReady={onNavigationReady}
          onStateChange={onNavigationStateChange}>
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
        </NavigationContainer>
      </>
    );
  }
};

export default NavigatorComponent;
