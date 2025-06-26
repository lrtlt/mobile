import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {Article} from '../../../../../../../Types';
import {HomeBlockCategory} from '../../../../../../api/Types';
import {ArticleRow, MoreArticlesButton, SectionHeader} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {formatArticles} from '../../../../../../util/articleFormatters';
import {useNavigationStore} from '../../../../../../state/navigation_store';

interface CategoryArticlesBlockProps {
  block: HomeBlockCategory;
}

const CategoryArticlesBlock: React.FC<CategoryArticlesBlockProps> = ({block}) => {
  const {data, template_id} = block;
  const {articles_list, category_id, category_title} = data;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const formattedArticles = useMemo(
    () => formatArticles(template_id, articles_list),
    [articles_list, template_id],
  );

  const articlePressHandler = useCallback(
    (article: Article) => {
      if (article.is_audio) {
        navigation.push('Podcast', {articleId: article.id});
      } else if (article.is_video) {
        navigation.push('Vodcast', {articleId: article.id});
      } else {
        navigation.push('Article', {articleId: article.id});
      }
    },
    [navigation],
  );

  const onHeaderPressHandler = useCallback(() => {
    useNavigationStore.getState().openCategoryById(category_id, category_title);
  }, [category_id, category_title]);

  const articleList = useMemo(
    () =>
      formattedArticles.map((row, index) => (
        <ArticleRow key={index} data={row} onArticlePress={articlePressHandler} />
      )),
    [articlePressHandler, formattedArticles],
  );

  return (
    <View>
      <SectionHeader
        category={{name: category_title, template_id: template_id, id: category_id}}
        onPress={onHeaderPressHandler}
      />
      {articleList}
      <MoreArticlesButton onPress={onHeaderPressHandler} />
    </View>
  );
};

export default CategoryArticlesBlock;
