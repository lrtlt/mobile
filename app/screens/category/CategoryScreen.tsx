import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import SimpleArticleScreen from '../main/tabScreen/simple/SimpleArticleScreen';
import {ROUTE_TYPE_CATEGORY} from '../../api/Types';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Category'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Category'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CategoryScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {id, name, url} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [name, navigation]);

  //Not using navigation analytics here because it's already used in ArticleTabScreen

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <SimpleArticleScreen
        type={ROUTE_TYPE_CATEGORY}
        isCurrent={false}
        showTitle={false}
        categoryId={id}
        categoryTitle={name}
        categoryUrl={url}
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
