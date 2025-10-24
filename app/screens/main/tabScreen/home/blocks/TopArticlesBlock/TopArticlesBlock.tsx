import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {Article} from '../../../../../../../Types';
import {HomeBlockTopArticles} from '../../../../../../api/Types';
import {ArticleRow} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {formatArticles} from '../../../../../../util/articleFormatters';
import {pushArticle} from '../../../../../../util/NavigationUtils';

interface TopArticlesBlockProps {
  block: HomeBlockTopArticles;
}

const TopArticlesBlock: React.FC<TopArticlesBlockProps> = ({block}) => {
  const {articles} = block;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const formattedArticles = useMemo(() => formatArticles(-1, articles), [articles]);

  const articlePressHandler = useCallback(
    (article: Article) => {
      pushArticle(navigation, article);
    },
    [navigation],
  );

  const articleList = useMemo(
    () =>
      formattedArticles.map((row, index) => (
        <ArticleRow key={index} data={row} onArticlePress={articlePressHandler} />
      )),
    [articlePressHandler, formattedArticles],
  );

  return <>{articleList}</>;
};

export default TopArticlesBlock;
