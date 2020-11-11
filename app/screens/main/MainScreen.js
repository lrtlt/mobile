import React, {useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {StatusBar, ActionButton} from '../../components';
import {SettingsIcon, Logo} from '../../components/svg';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BorderlessButton} from 'react-native-gesture-handler';
import Styles from './styles';
import TabBar from './tabBar/TabBar';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedCategory} from '../../redux/actions';
import HomeScreen from './tabScreen/home/HomeScreen';
import CategoryScreen from './tabScreen/category/CategoryScreen';
import NewestScreen from './tabScreen/newest/NewestScreen';
import PopularScreen from './tabScreen/popular/PopularScreen';
import TestScreen from '../testScreen/TestScreen';
import Gemius from 'react-native-gemius-plugin';
import EStyleSheet from 'react-native-extended-stylesheet';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_LOGO_PRESS} from '../../constants';

import {
  ARTICLE_LIST_TYPE_HOME,
  ARTICLE_LIST_TYPE_CATEGORY,
  ARTICLE_LIST_TYPE_MEDIA,
  ARTICLE_LIST_TYPE_NEWEST,
  GEMIUS_VIEW_SCRIPT_ID,
  ARTICLE_LIST_TYPE_POPULAR,
} from '../../constants';
import {selectMainScreenState} from '../../redux/selectors';

const MainScreen = (props) => {
  const {navigation} = props;

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'main'});

    navigation.dangerouslyGetParent().setOptions({
      headerLeft: (_) => (
        <ActionButton onPress={() => navigation.toggleDrawer()}>
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
    });
  }, []);

  const state = useSelector(selectMainScreenState);

  const dispatch = useDispatch();

  const handleIndexChange = (index) => dispatch(setSelectedCategory(index));

  const renderTabBar = (tabBarProps) => <TabBar {...tabBarProps} />;

  const renderScene = (sceneProps) => {
    //Render only 1 screen on each side
    const routeIndex = state.routes.indexOf(sceneProps.route);
    if (Math.abs(state.index - routeIndex) > 1) {
      return <View />;
    }

    const current = routeIndex === state.index;

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
    <View style={Styles.container}>
      <StatusBar />
      <TabView
        navigationState={state}
        swipeEnabled={true}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        // removeClippedSubviews={true}
        onIndexChange={handleIndexChange}
        lazy={true}
        lazyPreloadDistance={0}
        initialLayout={{height: 0, width: Dimensions.get('window').width}}
      />
    </View>
  );
};

export default MainScreen;
