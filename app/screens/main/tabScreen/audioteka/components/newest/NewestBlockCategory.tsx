import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Article} from '../../../../../../../Types';
import {AudiotekaNewestCategory} from '../../../../../../api/Types';
import {ArticleRow} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {formatArticles} from '../../../../../../util/articleFormatters';
import {navigateArticle} from '../../../../../../util/NavigationUtils';

interface Props {
  data: AudiotekaNewestCategory;
}

const NewestBlockCategory: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const onArticlePressHandler = useCallback(
    (article: Article) => {
      navigateArticle(navigation, article);
    },
    [navigation],
  );

  const content = useMemo(() => {
    const articles = formatArticles(-1, data.articles);
    return articles.map((a) => (
      <ArticleRow
        key={a.map((article) => article.id).join('-')}
        data={a}
        onArticlePress={onArticlePressHandler}
      />
    ));
  }, [data.articles, onArticlePressHandler]);

  return <View style={styles.container}>{content}</View>;
};

export default NewestBlockCategory;

const styles = StyleSheet.create({
  container: {},
});
