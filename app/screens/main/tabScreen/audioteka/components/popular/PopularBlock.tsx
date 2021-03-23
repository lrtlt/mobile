import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {AudiotekaPopular} from '../../../../../../api/Types';
import {ArticleRow, SectionHeader} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import BlockTitle from '../BlockTitle';

interface Props {
  data: AudiotekaPopular;
}

const PopularBlock: React.FC<Props> = ({data}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  return (
    <View style={styles.container}>
      <BlockTitle style={styles.title} text={data.title} />
      <ArticleRow
        data={data.articles}
        onArticlePress={(article) => {
          navigation.navigate('Article', {articleId: article.id});
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
