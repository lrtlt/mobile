import React, {useCallback, useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {SceneRendererProps, TabView} from 'react-native-tab-view';
import {ActionButton, Logo} from '../../components';
import {IconDrawerMenu, IconSettings} from '../../components/svg';
import {BorderlessButton} from 'react-native-gesture-handler';
import TabBar from './tabBar/TabBar';
import {useSelector} from 'react-redux';
import HomeScreen from './tabScreen/home/HomeScreen';
import TestScreen from '../testScreen/TestScreen';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_LOGO_PRESS, EVENT_SELECT_CATEGORY_INDEX} from '../../constants';
import {selectMainScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import AudiotekaScreen from './tabScreen/audioteka/AudiotekaScreen';
import {
  ROUTE_TYPE_HOME,
  ROUTE_TYPE_AUDIOTEKA,
  ROUTE_TYPE_CATEGORY,
  ROUTE_TYPE_MEDIA,
  ROUTE_TYPE_NEWEST,
  ROUTE_TYPE_POPULAR,
} from '../../api/Types';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {MainDrawerParamList, MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import ArticleTabScreen from './tabScreen/ArticleTabScreen';

type ScreenRouteProp = RouteProp<MainDrawerParamList, 'Main'>;

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Home'>,
  DrawerNavigationProp<MainDrawerParamList, 'Main'>
>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const MainScreen: React.FC<Props> = ({navigation}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const {colors, dim} = useTheme();

  const state = useSelector(selectMainScreenState, (left, right) => {
    return left.routes.length === right.routes.length;
  });

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_SELECT_CATEGORY_INDEX, (data) => {
      if (data.index !== -1) {
        setSelectedTabIndex(data.index);
      }
    });
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, [state]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <ActionButton onPress={() => navigation.toggleDrawer()}>
          <IconDrawerMenu size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerRight: () => (
        <ActionButton onPress={() => navigation.navigate('Settings')}>
          <IconSettings name="menu" size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerTitle: (
        <BorderlessButton
          onPress={() => {
            EventRegister.emit(EVENT_LOGO_PRESS, null);
          }}>
          <View style={styles.logoContainer}>
            <Logo size={dim.appBarIconSize + 4} />
          </View>
        </BorderlessButton>
      ),
    });
  }, [colors.headerTint, dim.appBarIconSize, navigation]);

  const renderScene = useCallback(
    (sceneProps: SceneRendererProps & {route: typeof state.routes[0]}) => {
      const {route} = sceneProps;
      const routeIndex = state.routes.findIndex((r) => r.key === route.key);

      //Render only selected screen
      if (Math.abs(selectedTabIndex - routeIndex) > 0) {
        return <View />;
      }
      const current = routeIndex === selectedTabIndex;

      switch (route.type) {
        case ROUTE_TYPE_HOME:
          return <HomeScreen type={ROUTE_TYPE_HOME} isCurrent={current} />;
        case ROUTE_TYPE_MEDIA:
          return <HomeScreen type={ROUTE_TYPE_MEDIA} isCurrent={current} />;
        case ROUTE_TYPE_AUDIOTEKA:
          return <AudiotekaScreen isCurrent={current} />;
        case ROUTE_TYPE_CATEGORY:
          return (
            <ArticleTabScreen
              type={ROUTE_TYPE_CATEGORY}
              isCurrent={current}
              showTitle={true}
              categoryId={route.categoryId}
              categoryTitle={route.title}
            />
          );
        case ROUTE_TYPE_NEWEST:
          return <ArticleTabScreen type={ROUTE_TYPE_NEWEST} isCurrent={current} showTitle={true} />;
        case ROUTE_TYPE_POPULAR:
          return <ArticleTabScreen type={ROUTE_TYPE_POPULAR} isCurrent={current} showTitle={true} />;
        default:
          return <TestScreen text={'Unkown type: ' + JSON.stringify(route)} />;
      }
    },
    [selectedTabIndex, state],
  );

  const renderLazyPlaceHolder = useCallback(() => {
    return <View />;
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <TabView
          renderLazyPlaceholder={renderLazyPlaceHolder}
          tabBarPosition="top"
          navigationState={{
            routes: state.routes,
            index: selectedTabIndex,
          }}
          swipeEnabled={true}
          renderScene={renderScene}
          renderTabBar={useCallback(
            (tabBarProps) => (
              <TabBar {...tabBarProps} />
            ),
            [],
          )}
          onIndexChange={setSelectedTabIndex}
          lazy={true}
          lazyPreloadDistance={0}
          initialLayout={{height: 0, width: Dimensions.get('screen').width}}
        />
      </SafeAreaView>
    </>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    paddingStart: 12,
    paddingEnd: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
