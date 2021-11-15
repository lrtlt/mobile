import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {Article} from '../../../../../../../Types';
import {HomeBlockSlug} from '../../../../../../api/Types';
import {ArticleRow, SectionHeader} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {formatArticles} from '../../../../../../util/articleFormatters';

interface SlugArticlesBlockProps {
  block: HomeBlockSlug;
}

const SlugArticlesBlock: React.FC<SlugArticlesBlockProps> = ({block}) => {
  const {data, template_id} = block;
  const {articles_list, slug_title, slug_url} = data;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

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
    navigation.navigate('Slug', {
      name: slug_title,
      slugUrl: slug_url,
    });
  }, [navigation, slug_title, slug_url]);

  const articleList = useMemo(
    () =>
      formattedArticles.map((row, index) => (
        <ArticleRow key={index} data={row} onArticlePress={articlePressHandler} isSlug={true} />
      )),
    [articlePressHandler, formattedArticles],
  );

  return (
    <View>
      <SectionHeader
        category={{name: slug_title, template_id: template_id, is_slug_block: 1, slug_url: slug_url}}
        onPress={onHeaderPressHandler}
      />
      {articleList}
    </View>
  );
};

export default SlugArticlesBlock;
