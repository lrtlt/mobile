import React, {useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TabView} from 'react-native-tab-view';
import TabBar from '../main/tabBar/TabBar';
import CategoryScreen from '../main/tabScreen/category/CategoryScreen';
import TestScreen from '../testScreen/TestScreen';

import {ARTICLE_LIST_TYPE_CATEGORY} from '../../constants';

const CustomPageScreen = (props) => {
  const {navigation, route} = props;
  const {page} = route.params;
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: page.title ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.title]);

  const renderTabBar = (tabBarProps) => <TabBar {...tabBarProps} />;

  const renderScene = (sceneProps) => {
    //Render only 1 screen on each side
    const routeIndex = page.routes.indexOf(sceneProps.route);
    if (Math.abs(currentRouteIndex - routeIndex) > 1) {
      return <View />;
    }

    const {type} = sceneProps.route;

    switch (type) {
      case ARTICLE_LIST_TYPE_CATEGORY:
        return <CategoryScreen route={sceneProps.route} />;
      default:
        return <TestScreen text={'Unkown type: ' + type} />;
    }
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{
          index: currentRouteIndex,
          routes: page.routes,
        }}
        swipeEnabled={true}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
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
