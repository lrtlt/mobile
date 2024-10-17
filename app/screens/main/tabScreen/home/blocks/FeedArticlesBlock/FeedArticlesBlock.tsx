import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Article} from '../../../../../../../Types';
import {HomeBlockArticlesBlock} from '../../../../../../api/Types';
import {ArticleComponent, ArticleFeedItem} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import ArticleTextOnlyItem from '../../../../../../components/article/articleTextOnlyItem/ArticleTextOnlyItem';
import {ScrollView} from 'react-native-gesture-handler';

interface FeedArticlesBlockProps {
  block: HomeBlockArticlesBlock;
}

const FeedArticlesBlock: React.FC<FeedArticlesBlockProps> = ({block}) => {
  const {data} = block;
  const {articles_list, articles_list2} = data;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const articlePressHandler = useCallback(
    (article: Article) => {
      navigation.navigate('Article', {articleId: article.id});
    },
    [navigation],
  );

  const articleList = useMemo(
    () =>
      articles_list
        .slice(1, articles_list.length)
        .map((article, index) => (
          <ArticleFeedItem key={index} article={article} onPress={articlePressHandler} />
        )),
    [articlePressHandler, articles_list],
  );

  const horizontalArticleList = useMemo(
    () =>
      articles_list2.map((article, index) => (
        <ArticleTextOnlyItem key={index} index={index} article={article} onPress={articlePressHandler} />
      )),
    [articlePressHandler, articles_list],
  );
  return (
    <View style={styles.root}>
      <ArticleComponent article={articles_list[0]} onPress={articlePressHandler} styleType="single" />
      {articleList}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row', gap: 12}}>{horizontalArticleList}</View>
      </ScrollView>
    </View>
  );
};

export default FeedArticlesBlock;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 8,
    gap: 24,
    paddingBottom: 32,
  },
});
