import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Article} from '../../../../../../../Types';
import {HomeBlockCategory} from '../../../../../../api/Types';
import {ArticleRow, MoreArticlesButton, SectionHeader} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {openCategoryForId} from '../../../../../../redux/actions/navigation';
import {formatArticles} from '../../../../../../util/articleFormatters';

interface CategoryArticlesBlockProps {
  block: HomeBlockCategory;
}

const CategoryArticlesBlock: React.FC<CategoryArticlesBlockProps> = ({block}) => {
  const {data, template_id} = block;
  const {articles_list, category_id, category_title} = data;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const formattedArticles = useMemo(() => formatArticles(template_id, articles_list), [
    articles_list,
    template_id,
  ]);

  const articlePressHandler = useCallback(
    (article: Article) => {
      navigation.navigate('Article', {articleId: article.id});
    },
    [navigation],
  );

  const onHeaderPressHandler = useCallback(() => {
    dispatch(openCategoryForId(category_id));
  }, [category_id, dispatch]);

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
