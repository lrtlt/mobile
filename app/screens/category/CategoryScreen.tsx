import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import SimpleArticleScreen from '../main/tabScreen/simple/SimpleArticleScreen';
import {MENU_TYPE_CATEGORY} from '../../api/Types';
import {SIMPLIFIED_CATEGORY_ID} from '../../constants';
import useContentSideInsets from '../../hooks/useContentSideInsets';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Category'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Category'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CategoryScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const contentInsets = useContentSideInsets();
  const {id, name, url} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [name, navigation]);

  useEffect(() => {
    if (id === SIMPLIFIED_CATEGORY_ID) {
      navigation.replace('Simple');
    }
  }, [navigation]);

  //Not using navigation analytics here because it's already used in ArticleTabScreen

  return (
    <View style={[styles.screen, {paddingLeft: contentInsets.left, paddingRight: contentInsets.right}]}>
      <SimpleArticleScreen
        type={MENU_TYPE_CATEGORY}
        showTitle={false}
        categoryId={id}
        categoryTitle={name}
        categoryUrl={url}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
