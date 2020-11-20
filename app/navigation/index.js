import React from 'react';
import {Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {Drawer, SearchFilterDrawer} from '../components';
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

import {selectNavigationIsReady} from '../redux/selectors';
import {themeDark, themeLight} from '../Theme';
import {useSettings} from '../settings/useSettings';

const Stack = createStackNavigator();
const MainDrawer = createDrawerNavigator();
const SearchDrawer = createDrawerNavigator();

const NavigatorComponent = () => {
  const isNavigationReady = useSelector(selectNavigationIsReady);

  const settings = useSettings();

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
          drawerType="front"
          hideStatusBar={false}
          drawerContent={() => <SearchFilterDrawer />}>
          <SearchDrawer.Screen name="SearchScreen" component={SearchScreen} options={{headerShown: false}} />
        </SearchDrawer.Navigator>
      );
    };

    const theme = settings.isDarkMode ? themeDark : themeLight;

    console.log('SETTINGS', settings);

    return (
      <NavigationContainer theme={theme}>
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
          <Stack.Screen name="Search" component={SearchDrawerNavigator} />
          <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Program" component={ProgramScreen} />
          <Stack.Screen name="Slug" component={SlugScreen} />
          <Stack.Screen name="CustomPage" component={CustomPageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default NavigatorComponent;
