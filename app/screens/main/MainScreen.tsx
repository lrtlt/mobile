import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {View, Dimensions, StyleSheet, Animated as RNAnimated} from 'react-native';
import {SceneRendererProps, TabView} from 'react-native-tab-view';
import {ActionButton, Logo} from '../../components';
import {IconDrawerMenu, IconUserNew} from '../../components/svg';
import {Pressable} from 'react-native-gesture-handler';
import TabBar from './tabBar/TabBar';
import HomeScreen from './tabScreen/home/HomeScreen';
import TestScreen from '../testScreen/TestScreen';
import {EventRegister} from 'react-native-event-listeners';
import {EVENT_LOGO_PRESS, EVENT_OPEN_CATEGORY, EVENT_SELECT_CATEGORY_INDEX} from '../../constants';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';

import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {MainDrawerParamList, MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import SimpleArticleScreen from './tabScreen/simple/SimpleArticleScreen';
import WalkthroughModal from '../../components/walkthroughModal/WalkthroughModal';
import useOnboardingLogic from './useOnboardingLogic';
import {useNavigationStore} from '../../state/navigation_store';
import CategoryHomeScreen from './tabScreen/category/CategoryHomeScreen';
import RadiotekaScreen from './tabScreen/radioteka/RadiotekaScreen';
import MediatekaScreen from './tabScreen/mediateka/MediatekaScreen';
import {
  MENU_TYPE_CATEGORY,
  MENU_TYPE_HOME,
  MENU_TYPE_MEDIATEKA,
  MENU_TYPE_NEWEST,
  MENU_TYPE_POPULAR,
  MENU_TYPE_RADIOTEKA,
} from '../../api/Types';
import {useAuth0} from 'react-native-auth0';
import UserAvatar from '../user/components/UserAvatar';

type ScreenRouteProp = RouteProp<MainDrawerParamList, 'Main'>;

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Home'>,
  DrawerNavigationProp<MainDrawerParamList, 'Main'>
>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const TAB_BAR_HEIGHT = 48;

const MainScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {user} = useAuth0();
  const {colors, dim} = useTheme();

  const {isVisible, onClose} = useOnboardingLogic();

  // Scroll-based TabBar visibility
  const isTabBarVisible = useSharedValue(1);
  const lastContentOffset = useSharedValue(0);
  const tabBarPosition = useRef(new RNAnimated.Value(selectedTabIndex)).current;

  useEffect(() => {
    RNAnimated.timing(tabBarPosition, {
      toValue: selectedTabIndex,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Show TabBar when tab changes (swipe or click)
    isTabBarVisible.value = withTiming(1, {duration: 200});
    lastContentOffset.value = 0;
  }, [selectedTabIndex, tabBarPosition, isTabBarVisible, lastContentOffset]);

  const handleScroll = useCallback((event: any) => {
    'worklet';
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - lastContentOffset.value;

    // Only hide/show if scrolled more than threshold and not at the top
    if (Math.abs(diff) > 5 && currentOffset > 50) {
      if (diff > 0) {
        // Scrolling down - hide tab bar
        isTabBarVisible.value = withTiming(0, {duration: 200});
      } else {
        // Scrolling up - show tab bar
        isTabBarVisible.value = withTiming(1, {duration: 200});
      }
    } else if (currentOffset <= 50) {
      // Always show tab bar when near the top
      isTabBarVisible.value = withTiming(1, {duration: 200});
    }

    lastContentOffset.value = currentOffset;
  }, []);

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: (1 - isTabBarVisible.value) * -TAB_BAR_HEIGHT}],
      opacity: isTabBarVisible.value,
    };
  });

  const routes = useNavigationStore((state) => state.routesV2);
  const state = useMemo(() => {
    return {
      routes: routes
        .filter((r) => r && r.type && r.title)
        .map((r) => {
          if (r.type === MENU_TYPE_CATEGORY) {
            return {
              type: r.type,
              key: r.url || r.title,
              title: r.title,
              categoryId: r.category_id,
              categoryUrl: r.url,
              hasHome: r.hasHome,
            };
          } else {
            return {type: r.type, key: r.title, title: r.title};
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
      headerLeftContainerStyle: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      },
      headerRight: () => (
        <ActionButton
          onPress={async () => {
            navigation.navigate('User', {instantLogin: false});
          }}
          accessibilityLabel="Nustatymai"
          accessibilityHint="Atidaryti nustatymų ekraną">
          {user ? (
            <UserAvatar size={dim.appBarIconSize} />
          ) : (
            <IconUserNew name="user" size={dim.appBarIconSize} color={colors.headerTint} />
          )}
        </ActionButton>
      ),
      headerRightContainerStyle: {
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      },
      headerTitle: () => (
        <Pressable
          onPress={() => {
            EventRegister.emit(EVENT_LOGO_PRESS, null);
            if (selectedTabIndex !== 0) {
              setSelectedTabIndex(0);
            }
          }}
          accessibilityLabel="LRT logotipas"
          accessibilityHint="Spauskite, kad atnaujinti naujienas"
          accessibilityRole="button"
          accessibilityLanguage="lt">
          <View style={styles.logoContainer}>
            <Logo width={75} height={40} />
          </View>
        </Pressable>
      ),
    });
  }, [colors.headerTint, dim.appBarIconSize, navigation, user, selectedTabIndex]);

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
        case MENU_TYPE_HOME:
          return <HomeScreen isCurrent={current} onScroll={handleScroll} paddingTop={TAB_BAR_HEIGHT} />;
        case MENU_TYPE_MEDIATEKA:
          return <MediatekaScreen onScroll={handleScroll} paddingTop={TAB_BAR_HEIGHT} />;
        case MENU_TYPE_RADIOTEKA:
          return <RadiotekaScreen onScroll={handleScroll} paddingTop={TAB_BAR_HEIGHT} />;
        case MENU_TYPE_CATEGORY:
          return route.hasHome ? (
            <CategoryHomeScreen
              id={route.categoryId}
              title={route.title}
              url={route.categoryUrl}
              onScroll={handleScroll}
              paddingTop={TAB_BAR_HEIGHT}
            />
          ) : (
            <SimpleArticleScreen
              type={MENU_TYPE_CATEGORY}
              showTitle
              showBackToHome
              categoryId={route.categoryId}
              categoryTitle={route.title}
              categoryUrl={route.categoryUrl}
              onScroll={handleScroll}
              paddingTop={TAB_BAR_HEIGHT}
            />
          );
        case MENU_TYPE_NEWEST:
          return (
            <SimpleArticleScreen
              type={MENU_TYPE_NEWEST}
              showTitle
              showBackToHome
              onScroll={handleScroll}
              paddingTop={TAB_BAR_HEIGHT}
            />
          );
        case MENU_TYPE_POPULAR:
          return (
            <SimpleArticleScreen
              type={MENU_TYPE_POPULAR}
              showTitle
              showBackToHome
              onScroll={handleScroll}
              paddingTop={TAB_BAR_HEIGHT}
            />
          );
        default:
          return <TestScreen text={'Unkown type: ' + JSON.stringify(route)} />;
      }
    },
    [selectedTabIndex, state, handleScroll],
  );

  const renderLazyPlaceHolder = useCallback(() => {
    return <View />;
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']} accessible={false}>
      <TabView
        accessible={false}
        renderLazyPlaceholder={renderLazyPlaceHolder}
        tabBarPosition="top"
        navigationState={{
          routes: state.routes,
          index: selectedTabIndex,
        }}
        // swipeEnabled={state.routes[selectedTabIndex]?.type !== MENU_TYPE_AUDIOTEKA}
        swipeEnabled={true}
        renderScene={renderScene}
        renderTabBar={() => null}
        onIndexChange={setSelectedTabIndex}
        lazy={true}
        lazyPreloadDistance={0}
        initialLayout={{height: 0, width: Dimensions.get('screen').width}}
      />
      <Animated.View style={[styles.tabBarContainer, tabBarAnimatedStyle]}>
        <TabBar
          navigationState={{
            routes: state.routes,
            index: selectedTabIndex,
          }}
          jumpTo={(key) => {
            const index = state.routes.findIndex((r) => r.key === key);
            if (index !== -1) {
              setSelectedTabIndex(index);
            }
          }}
          position={tabBarPosition}
          layout={{width: Dimensions.get('window').width, height: 0}}
        />
      </Animated.View>
      <WalkthroughModal
        visible={isVisible}
        onClose={onClose}
        onLogin={() => {
          onClose();
          setTimeout(() => {
            navigation.navigate('User', {instantLogin: true});
          }, 350);
        }}
      />
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
  tabBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
