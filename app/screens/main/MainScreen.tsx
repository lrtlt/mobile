import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
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

const MainScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {user} = useAuth0();
  const {colors, dim} = useTheme();

  const {isVisible, onClose} = useOnboardingLogic();

  const routes = useNavigationStore((state) => state.routesV2);
  const state = useMemo(() => {
    return {
      routes: routes.map((r) => {
        if (r.type === MENU_TYPE_CATEGORY) {
          return {
            type: r.type,
            key: r.url,
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
      headerLeftContainerStyle: {paddingStart: 4},
      headerRightContainerStyle: {paddingEnd: 4},
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
          onPress={async () => {
            navigation.navigate('User');
          }}
          accessibilityLabel="Nustatymai"
          accessibilityHint="Atidaryti nustatymų ekraną">
          {user ? (
            <UserAvatar size={dim.appBarIconSize + 4} />
          ) : (
            <IconUserNew name="user" size={dim.appBarIconSize + 4} color={colors.headerTint} />
          )}
        </ActionButton>
      ),

      headerTitle: () => (
        <Pressable
          onPress={() => {
            EventRegister.emit(EVENT_LOGO_PRESS, null);
          }}
          accessibilityLabel="LRT logotipas"
          accessibilityHint="Spauskite, kad atnaujinti naujienas"
          accessibilityRole="button"
          accessibilityLanguage="lt">
          <View style={styles.logoContainer}>
            <Logo />
          </View>
        </Pressable>
      ),
    });
  }, [colors.headerTint, dim.appBarIconSize, navigation, user]);

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
          return <HomeScreen isCurrent={current} />;
        case MENU_TYPE_MEDIATEKA:
          return <MediatekaScreen isCurrent={current} />;
        case MENU_TYPE_RADIOTEKA:
          return <RadiotekaScreen isCurrent={current} />;
        case MENU_TYPE_CATEGORY:
          return route.hasHome ? (
            <CategoryHomeScreen
              id={route.categoryId}
              title={route.title}
              url={route.categoryUrl}
              isCurrent={current}
            />
          ) : (
            <SimpleArticleScreen
              type={MENU_TYPE_CATEGORY}
              isCurrent={current}
              showTitle
              showBackToHome
              categoryId={route.categoryId}
              categoryTitle={route.title}
              categoryUrl={route.categoryUrl}
            />
          );
        case MENU_TYPE_NEWEST:
          return <SimpleArticleScreen type={MENU_TYPE_NEWEST} isCurrent={current} showTitle showBackToHome />;
        case MENU_TYPE_POPULAR:
          return (
            <SimpleArticleScreen type={MENU_TYPE_POPULAR} isCurrent={current} showTitle showBackToHome />
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
          // swipeEnabled={state.routes[selectedTabIndex]?.type !== MENU_TYPE_AUDIOTEKA}
          swipeEnabled={true}
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
