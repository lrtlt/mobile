import React from 'react';
import {View, StyleSheet, Linking} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../Theme';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import {useCallback} from 'react';
import {useRef} from 'react';
import MyScrollView from '../MyScrollView/MyScrollView';
import {useNavigationStore} from '../../state/navigation_store';
import {useShallow} from 'zustand/shallow';
import {MainStackParamList} from '../../navigation/MainStack';
import useOnDrawerClose from '../drawer/useOnDrawerClose';
import DrawerBasicItem from './components/DrawerBasicItem';
import {Menu2Item} from '../../api/Types';
import DrawerExpandableItem from './components/DrawerExpandableItem';
import DrawerChannelsItem from './components/DrawerChannelsItem';
import DrawerFooter from './components/DrawerFooter';
import {IconSearch} from '../svg';

type Props = {
  navigation: DrawerNavigationProp<MainStackParamList>;
};

const Drawer2Component: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {colors, dim} = useTheme();

  const menuItems = useNavigationStore(useShallow((state) => state.menu?.items));
  const {openHomeRoute, openMediatekaRoute, openRadiotekaRoute, openCategoryById} =
    useNavigationStore.getState();

  const insets = useSafeAreaInsets();
  const scrollRef = useRef<MyScrollView>(null);

  useOnDrawerClose(
    useCallback(() => {
      // scrollRef.current?.scrollTo({
      //   x: 0,
      //   y: 0,
      //   animated: false,
      // });
    }, []),
  );

  const handleItemPress = useCallback((item: Menu2Item) => {
    switch (item.type) {
      case 'home':
        openHomeRoute();
        navigation.closeDrawer();
        break;
      case 'mediateka':
        openMediatekaRoute();
        navigation.closeDrawer();
        break;
      case 'radioteka':
        openRadiotekaRoute();
        navigation.closeDrawer();
        break;
      case 'weather':
        navigation.navigate('Weather');
        break;
      case 'slug':
        navigation.navigate('Slug', {slugUrl: item.url, name: item.title});
        break;
      case 'program':
        navigation.navigate('Program');
        break;
      case 'category':
        openCategoryById(item.category_id);
        navigation.closeDrawer();
        break;
      case 'search':
        navigation.navigate('Search', {
          screen: 'SearchScreen',
          params: {},
        });
        break;
      case 'bookmarks':
        navigation.navigate('Bookmarks');
        break;
      case 'history':
        navigation.navigate('History');
        break;
      case 'page':
        navigation.navigate('Page', {
          page: {
            type: 'page',
            name: item.title,
            categories: item.categories,
          },
        });
        break;
      case 'webpage':
        Linking.openURL(item.url);
        break;
    }
  }, []);

  return (
    <View style={{...styles.container, backgroundColor: colors.background}}>
      <MyScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 16 + insets.top,
            paddingBottom: 16 + insets.bottom,
            paddingLeft: 0 + insets.left,
            paddingRight: 0 + insets.right,
          },
        ]}>
        {!!menuItems &&
          menuItems?.map((item) => {
            switch (item.type) {
              case 'home':
              case 'mediateka':
              case 'radioteka':
              case 'program':
              case 'category':
              case 'slug':
              case 'page':
              case 'webpage':
                return <DrawerBasicItem key={item.title} item={item} onPress={handleItemPress} />;
              case 'search':
                return (
                  <DrawerBasicItem
                    key={item.title}
                    item={item}
                    onPress={handleItemPress}
                    icon={<IconSearch size={dim.drawerIconSize} color={colors.text} />}
                  />
                );
              case 'channels':
                return <DrawerChannelsItem key={item.title} item={item} />;
              case 'expandable':
                return <DrawerExpandableItem key={item.title} item={item} onPress={handleItemPress} />;
              case 'group':
                return (
                  <DrawerExpandableItem
                    key={item.title}
                    item={item}
                    onPress={handleItemPress}
                    alwaysExpanded={true}
                  />
                );
              default:
                console.warn('Unknown menu item type', item);
                return null;
            }
          })}
        <DrawerFooter onPress={handleItemPress} />
      </MyScrollView>
    </View>
  );
};

export default Drawer2Component;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    minHeight: '100%',
  },
});
