import React, {useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {ActionButton} from '../../components';
import {Logo, IconDrawerMenu, IconSettings} from '../../components/svg';
import {BorderlessButton} from 'react-native-gesture-handler';
import TabBar from './tabBar/TabBar';
import {useSelector} from 'react-redux';
import HomeScreen from './tabScreen/home/HomeScreen';
import CategoryScreen from './tabScreen/category/CategoryScreen';
import NewestScreen from './tabScreen/newest/NewestScreen';
import PopularScreen from './tabScreen/popular/PopularScreen';
import TestScreen from '../testScreen/TestScreen';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_LOGO_PRESS, EVENT_SELECT_CATEGORY_INDEX} from '../../constants';
import {selectMainScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import AudiotekaScreen from './tabScreen/audioteka/AudiotekaScreen';
import {
  ROUTE_TYPE_HOME,
  ROUTE_TYPE_TYPE_AUDIOTEKA,
  ROUTE_TYPE_TYPE_CATEGORY,
  ROUTE_TYPE_TYPE_MEDIA,
  ROUTE_TYPE_TYPE_NEWEST,
  ROUTE_TYPE_TYPE_POPULAR,
} from '../../api/Types';

const MainScreen = (props) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {navigation} = props;
  const {colors, dim} = useTheme();

  const state = useSelector(selectMainScreenState, (left, right) => {
    return left.routes.length === right.routes.length;
  });

  console.log('render main screen');

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_SELECT_CATEGORY_INDEX, (data) => {
      if (data.index) {
        setSelectedTabIndex(data.index);
      }
    });
    return () => EventRegister.removeEventListener(listener);
  });

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (_) => (
        <ActionButton onPress={() => navigation.toggleDrawer()}>
          <IconDrawerMenu size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerRight: (_) => (
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

  const handleIndexChange = (index) => setSelectedTabIndex(index);

  const renderTabBar = (tabBarProps) => <TabBar {...tabBarProps} />;

  const renderScene = (sceneProps) => {
    const routeIndex = state.routes.findIndex((r) => r.key === sceneProps.route.key);

    //Render only 1 screen on each side
    if (Math.abs(selectedTabIndex - routeIndex) > 0) {
      return <View />;
    }
    const current = routeIndex === selectedTabIndex;

    const {type} = sceneProps.route;
    switch (type) {
      case ROUTE_TYPE_HOME:
        return <HomeScreen type={ROUTE_TYPE_HOME} isCurrent={current} />;
      case ROUTE_TYPE_TYPE_MEDIA:
        return <HomeScreen type={ROUTE_TYPE_TYPE_MEDIA} isCurrent={current} />;
      case ROUTE_TYPE_TYPE_AUDIOTEKA:
        return <AudiotekaScreen isCurrent={current} />;
      case ROUTE_TYPE_TYPE_CATEGORY:
        return <CategoryScreen route={sceneProps.route} isCurrent={current} />;
      case ROUTE_TYPE_TYPE_NEWEST:
        return <NewestScreen isCurrent={current} />;
      case ROUTE_TYPE_TYPE_POPULAR:
        return <PopularScreen isCurrent={current} />;
      default:
        return <TestScreen text={'Unkown type: ' + type} />;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <TabView
          renderLazyPlaceholder={() => <View />}
          tabBarPosition="top"
          navigationState={{
            routes: state.routes,
            index: selectedTabIndex,
          }}
          swipeEnabled={true}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
          lazy={true}
          lazyPreloadDistance={0}
          initialLayout={{height: 0, width: Dimensions.get('window').width}}
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
