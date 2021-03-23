import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AudiotekaNewestCategory} from '../../../../../../api/Types';
import {ArticleRow} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {formatArticles} from '../../../../../../util/articleFormatters';

interface Props {
  data: AudiotekaNewestCategory;
}

const NewestBlockCategory: React.FC<Props> = ({data}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const articles = formatArticles(-1, data.articles);

  const content = articles.map((a) => (
    <ArticleRow
      key={a.map((article) => article.id).join('-')}
      data={a}
      onArticlePress={(article) => navigation.navigate('Article', {articleId: article.id})}
    />
  ));
  return <View style={styles.container}>{content}</View>;
};

export default NewestBlockCategory;

const styles = StyleSheet.create({
  container: {},
});
