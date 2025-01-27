import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {SceneRendererProps, TabView} from 'react-native-tab-view';
import {ActionButton, Logo} from '../../components';
import {IconDrawerMenu, IconSettings} from '../../components/svg';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import TabBar from './tabBar/TabBar';
import HomeScreen from './tabScreen/home/HomeScreen';
import TestScreen from '../testScreen/TestScreen';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_LOGO_PRESS, EVENT_OPEN_CATEGORY, EVENT_SELECT_CATEGORY_INDEX} from '../../constants';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
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
import SimpleArticleScreen from './tabScreen/simple/SimpleArticleScreen';
import NotificationsModal from '../../components/notificationsModal/NotificationsModal';
import useOnboardingLogic from './useOnboardingLogic';
import {useNavigationStore} from '../../state/navigation_store';
import CategoryHomeScreen from './tabScreen/category/CategoryHomeScreen';
import RadiotekaScreen from './tabScreen/radioteka/RadiotekaScreen';

type ScreenRouteProp = RouteProp<MainDrawerParamList, 'Main'>;

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Home'>,
  DrawerNavigationProp<MainDrawerParamList, 'Main'>
>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const MainScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const {colors, dim} = useTheme();

  const {isVisible, onClose} = useOnboardingLogic();

  const routes = useNavigationStore((state) => state.routes);
  const state = useMemo(() => {
    return {
      routes: routes.map((r) => {
        if (r.type === ROUTE_TYPE_CATEGORY) {
          return {
            type: r.type,
            key: r.name,
            title: r.name,
            categoryId: r.id,
            categoryUrl: r.url,
            hasHome: r.has_home_blocks,
          };
        } else {
          return {type: r.type, key: r.name, title: r.name};
        }
      }),
    };
  }, [routes]);

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
    const listener = EventRegister.addEventListener(EVENT_OPEN_CATEGORY, ({id, title}) => {
      if (id) {
        navigation.navigate('Category', {
          id: id,
          name: title ?? '',
          url: '',
        });
      }
    });
    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, [navigation, state]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <ActionButton
          onPress={() => navigation.toggleDrawer()}
          accessibilityLabel="Šoninis meniu"
          accessibilityHint="Atidaryti šoninį meniu">
          <IconDrawerMenu size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerRight: () => (
        <ActionButton
          onPress={() => navigation.navigate('Settings')}
          accessibilityLabel="Nustatymai"
          accessibilityHint="Atidaryti nustatymų ekraną">
          <IconSettings name="menu" size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),

      headerTitle: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            EventRegister.emit(EVENT_LOGO_PRESS, null);
          }}
          accessibilityLabel="LRT logotipas"
          accessibilityHint="Spauskite, kad atnaujinti naujienas"
          accessibilityRole="button"
          accessibilityLanguage="lt">
          <View style={styles.logoContainer}>
            <Logo height={dim.appBarIconSize + 6} />
          </View>
        </TouchableWithoutFeedback>
      ),
    });
  }, [colors.headerTint, dim.appBarIconSize, navigation]);

  const renderScene = useCallback(
    (sceneProps: SceneRendererProps & {route: (typeof state.routes)[0]}) => {
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
          return <RadiotekaScreen isCurrent={current} />;
        case ROUTE_TYPE_CATEGORY:
          return route.hasHome ? (
            <CategoryHomeScreen
              id={route.categoryId}
              title={route.title}
              url={route.categoryUrl}
              isCurrent={current}
            />
          ) : (
            <SimpleArticleScreen
              type={ROUTE_TYPE_CATEGORY}
              isCurrent={current}
              showTitle
              showBackToHome
              categoryId={route.categoryId}
              categoryTitle={route.title}
              categoryUrl={route.categoryUrl}
            />
          );
        case ROUTE_TYPE_NEWEST:
          return (
            <SimpleArticleScreen type={ROUTE_TYPE_NEWEST} isCurrent={current} showTitle showBackToHome />
          );
        case ROUTE_TYPE_POPULAR:
          return (
            <SimpleArticleScreen type={ROUTE_TYPE_POPULAR} isCurrent={current} showTitle showBackToHome />
          );
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
    <SafeAreaView style={styles.container} edges={['left', 'right']} accessible={false}>
      <>
        <TabView
          accessible={false}
          renderLazyPlaceholder={renderLazyPlaceHolder}
          tabBarPosition="top"
          navigationState={{
            routes: state.routes,
            index: selectedTabIndex,
          }}
          swipeEnabled={state.routes[selectedTabIndex]?.type !== ROUTE_TYPE_AUDIOTEKA}
          renderScene={renderScene}
          renderTabBar={(tabBarProps) => <TabBar {...tabBarProps} />}
          onIndexChange={setSelectedTabIndex}
          lazy={true}
          lazyPreloadDistance={0}
          initialLayout={{height: 0, width: Dimensions.get('screen').width}}
        />
        <NotificationsModal visible={isVisible} onClose={onClose} />
      </>
    </SafeAreaView>
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
