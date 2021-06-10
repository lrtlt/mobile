import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import ArticleTabScreen from '../main/tabScreen/ArticleTabScreen';
import {ROUTE_TYPE_CATEGORY} from '../../api/Types';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Category'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Category'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CategoryScreen: React.FC<Props> = ({navigation, route}) => {
  const {id, name} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [name, navigation]);

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ArticleTabScreen
        type={ROUTE_TYPE_CATEGORY}
        isCurrent={false}
        showTitle={false}
        categoryId={id}
        categoryTitle={name}
      />
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
