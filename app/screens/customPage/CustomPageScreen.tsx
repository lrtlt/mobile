import React, {useCallback, useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TabView} from 'react-native-tab-view';
import TabBar from '../main/tabBar/TabBar';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import SimpleArticleScreen from '../main/tabScreen/simple/SimpleArticleScreen';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {MENU_TYPE_CATEGORY} from '../../api/Types';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Page'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Page'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CustomPageScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const {page} = route.params;

  const routes = page.categories.map((c) => ({
    categoryId: c.id,
    key: c.name,
    title: c.name,
  }));

  useNavigationAnalytics({
    viewId: `Lrt app - Page -  ${page.type}`,
    title: `Lrt app - Page - ${page.name}`,
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: page.name ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.name]);

  const renderLazyPlaceHolder = useCallback(() => {
    return <View />;
  }, []);

  return (
    <View style={styles.container}>
      <TabView
        renderLazyPlaceholder={renderLazyPlaceHolder}
        tabBarPosition="top"
        navigationState={{
          index: currentRouteIndex,
          routes: routes,
        }}
        swipeEnabled={true}
        renderScene={(sceneProps) => {
          const routeIndex = routes.indexOf(sceneProps.route);
          if (Math.abs(currentRouteIndex - routeIndex) > 0) {
            return <View />;
          } else {
            const {route: sceneRounte} = sceneProps;
            return (
              <SimpleArticleScreen
                type={MENU_TYPE_CATEGORY}
                showTitle
                categoryId={sceneRounte.categoryId}
                categoryTitle={sceneRounte.title}
              />
            );
          }
        }}
        renderTabBar={(tabBarProps) => <TabBar {...tabBarProps} />}
        onIndexChange={setCurrentRouteIndex}
        lazy={true}
        lazyPreloadDistance={0}
        initialLayout={{height: 0, width: Dimensions.get('screen').width}}
      />
    </View>
  );
};

export default CustomPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
