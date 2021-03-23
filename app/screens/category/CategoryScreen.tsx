import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import CategoryTabScreen from '../main/tabScreen/category/CategoryTabScreen';

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
  }, []);

  return (
    <View style={styles.screen}>
      <CategoryTabScreen categoryId={id} categoryTitle={name} />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
