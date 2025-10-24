import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';

import {View, StyleSheet} from 'react-native';
import {AudiotekaPopular} from '../../../../../../api/Types';
import {ArticleRow} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import BlockTitle from '../BlockTitle';
import {navigateArticle} from '../../../../../../util/NavigationUtils';

interface Props {
  data: AudiotekaPopular;
}

const PopularBlock: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  return (
    <View style={styles.container}>
      <BlockTitle style={styles.title} text={data.title} />
      <ArticleRow
        data={data.articles}
        onArticlePress={(article) => {
          navigateArticle(navigation, article);
        }}
      />
    </View>
  );
};

export default PopularBlock;

const styles = StyleSheet.create({
  container: {},
  title: {
    margin: 8,
  },
});
