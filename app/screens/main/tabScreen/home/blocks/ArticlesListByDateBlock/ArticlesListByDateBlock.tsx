import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {Article} from '../../../../../../../Types';
import {HomeBlockArticlesByDate} from '../../../../../../api/Types';
import {ArticleRow, MoreArticlesButton, SectionHeader} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {formatArticles} from '../../../../../../util/articleFormatters';

interface ArticlesListByDateBlockProps {
  block: HomeBlockArticlesByDate;
  category_id: number;
  category_title: string;
  category_url: string;
}

const ArticlesListByDateBlock: React.FC<ArticlesListByDateBlockProps> = ({
  block,
  category_id,
  category_title,
  category_url,
}) => {
  const {articles_list, template_id} = block;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const formattedArticles = useMemo(
    () => formatArticles(template_id, articles_list),
    [articles_list, template_id],
  );

  const articlePressHandler = useCallback(
    (article: Article) => {
      navigation.navigate('Article', {articleId: article.id});
    },
    [navigation],
  );

  const onHeaderPressHandler = useCallback(() => {
    navigation.navigate('Category', {
      id: category_id,
      name: category_title,
      url: category_url,
    });
  }, []);

  const articleList = useMemo(
    () =>
      formattedArticles.map((row, index) => (
        <ArticleRow key={`row-${index}`} data={row} onArticlePress={articlePressHandler} />
      )),
    [articlePressHandler, formattedArticles],
  );

  return (
    <View>
      <SectionHeader
        category={{name: 'Naujausi', template_id: template_id, id: category_id}}
        onPress={onHeaderPressHandler}
      />
      {articleList}
      <MoreArticlesButton onPress={onHeaderPressHandler} />
    </View>
  );
};

export default ArticlesListByDateBlock;
