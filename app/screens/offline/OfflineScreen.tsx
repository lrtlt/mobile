import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {View, Dimensions, StyleSheet} from 'react-native';
import {MainStackParamList} from '../../navigation/MainStack';
import {useNavigationStore} from '../../state/navigation_store';
import {useTheme} from '../../Theme';
import React, {useCallback, useEffect, useState} from 'react';
import TabBar from '../main/tabBar/TabBar';
import {TabView, TabViewProps} from 'react-native-tab-view';
import CachedArticlesScreen from './CachedArticlesScreen';
import {HeaderBackButton} from '@react-navigation/elements';
import {ActionButton} from '../../components';
import {IconSettings} from '../../components/svg';
import {logEvent, getAnalytics} from '@react-native-firebase/analytics';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Offline'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Offline'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

type Route = {
  key: string;
  title: string;
};

const OfflineScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {colors, strings, dim} = useTheme();

  const [index, setIndex] = useState(0);

  const [routes] = useState<Route[]>([
    {key: 'saved', title: strings.bookmarks},
    {key: 'history', title: strings.history},
  ]);

  const {setOfflineMode} = useNavigationStore();

  useEffect(() => {
    logEvent(getAnalytics(), 'app_lrt_lt_offline_mode_entered');
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={onSetOnlinePress} tintColor={colors.headerTint} />,
      headerRight: () => (
        <ActionButton
          onPress={() => navigation.navigate('Settings')}
          accessibilityLabel="Nustatymai"
          accessibilityHint="Atidaryti nustatymų ekraną">
          <IconSettings name="menu" size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
    });
  }, [navigation, colors]);

  const onSetOnlinePress = () => {
    setOfflineMode(false);
  };

  const renderScene: TabViewProps<Route>['renderScene'] = useCallback(({route}) => {
    switch (route.key) {
      case 'saved':
        return <CachedArticlesScreen type="bookmarks" />;
      case 'history':
        return <CachedArticlesScreen type="history" />;
      default:
        return null;
    }
  }, []);

  const renderTabBar = useCallback((tabBarProps: any) => <TabBar {...tabBarProps} />, [colors]);

  return (
    <View style={styles.root}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: Dimensions.get('window').width}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default OfflineScreen;
