import React, {useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {ActionButton} from '../../components';
import {SettingsIcon, Logo} from '../../components/svg';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BorderlessButton} from 'react-native-gesture-handler';
import TabBar from './tabBar/TabBar';
import {useSelector} from 'react-redux';
import HomeScreen from './tabScreen/home/HomeScreen';
import CategoryScreen from './tabScreen/category/CategoryScreen';
import NewestScreen from './tabScreen/newest/NewestScreen';
import PopularScreen from './tabScreen/popular/PopularScreen';
import TestScreen from '../testScreen/TestScreen';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_LOGO_PRESS, EVENT_SELECT_CATEGORY_INDEX} from '../../constants';

import {
  ARTICLE_LIST_TYPE_HOME,
  ARTICLE_LIST_TYPE_CATEGORY,
  ARTICLE_LIST_TYPE_MEDIA,
  ARTICLE_LIST_TYPE_NEWEST,
  GEMIUS_VIEW_SCRIPT_ID,
  ARTICLE_LIST_TYPE_POPULAR,
} from '../../constants';
import {selectMainScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';

const MainScreen = (props) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {navigation} = props;
  const {colors, dim} = useTheme();

  const state = useSelector(selectMainScreenState);

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'main'});
  }, []);

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
          <MaterialIcon name="menu" size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerRight: (_) => (
        <ActionButton onPress={() => navigation.navigate('Settings')}>
          <SettingsIcon name="menu" size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerTitle: (
        <BorderlessButton
          onPress={() => {
            EventRegister.emit(EVENT_LOGO_PRESS, null);
          }}>
          <View style={styles.logoContainer}>
            <Logo size={dim.appBarIconSize} />
          </View>
        </BorderlessButton>
      ),
    });
  }, [colors.headerTint, dim.appBarIconSize, navigation]);

  const handleIndexChange = (index) => setSelectedTabIndex(index);

  const renderTabBar = (tabBarProps) => <TabBar {...tabBarProps} />;

  const renderScene = (sceneProps) => {
    //Render only 1 screen on each side
    const routeIndex = state.routes.indexOf(sceneProps.route);
    if (Math.abs(selectedTabIndex - routeIndex) > 1) {
      return <View />;
    }

    const current = routeIndex === selectedTabIndex;

    const {type} = sceneProps.route;
    switch (type) {
      case ARTICLE_LIST_TYPE_HOME:
        return <HomeScreen type={ARTICLE_LIST_TYPE_HOME} isCurrent={current} />;
      case ARTICLE_LIST_TYPE_MEDIA:
        return <HomeScreen type={ARTICLE_LIST_TYPE_MEDIA} isCurrent={current} />;
      case ARTICLE_LIST_TYPE_CATEGORY:
        return <CategoryScreen route={sceneProps.route} isCurrent={current} />;
      case ARTICLE_LIST_TYPE_NEWEST:
        return <NewestScreen isCurrent={current} />;
      case ARTICLE_LIST_TYPE_POPULAR:
        return <PopularScreen isCurrent={current} />;
      default:
        return <TestScreen text={'Unkown type: ' + type} />;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <TabView
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
  },
});
