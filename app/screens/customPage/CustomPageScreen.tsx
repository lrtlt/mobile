import React, {useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {Route, TabView} from 'react-native-tab-view';
import TabBar from '../main/tabBar/TabBar';
import CategoryScreen from '../main/tabScreen/category/CategoryScreen';
import {MenuItemPage} from '../../api/Types';

const CustomPageScreen = (props: any) => {
  const {navigation, route} = props;
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);

  const page = route.params.page as MenuItemPage;
  const routes: Route[] = page.categories.map((c) => ({
    categoryId: c.id,
    key: c.name,
    title: c.name,
  }));

  useEffect(() => {
    navigation.setOptions({
      headerTitle: page.name ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.name]);

  return (
    <View style={styles.container}>
      <TabView
        renderLazyPlaceholder={() => <View />}
        tabBarPosition="top"
        navigationState={{
          index: currentRouteIndex,
          routes: routes,
        }}
        swipeEnabled={true}
        renderScene={(sceneProps) => {
          //Render only 1 screen on each side
          const routeIndex = routes.indexOf(sceneProps.route);
          if (Math.abs(currentRouteIndex - routeIndex) > 1) {
            return <View />;
          } else {
            console.log('route', sceneProps.route);
            return <CategoryScreen route={sceneProps.route} />;
          }
        }}
        renderTabBar={(tabBarProps) => <TabBar {...tabBarProps} />}
        onIndexChange={(i) => setCurrentRouteIndex(i)}
        lazy={true}
        lazyPreloadDistance={0}
        initialLayout={{height: 0, width: Dimensions.get('window').width}}
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
