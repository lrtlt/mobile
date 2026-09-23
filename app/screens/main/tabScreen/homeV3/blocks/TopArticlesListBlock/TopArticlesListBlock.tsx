import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HomeV3BlockTopArticlesList} from '../../../../../../api/Types';
import ArticleListItem from '../../components/ArticleListItem';

interface TopArticlesListBlockProps {
  block: HomeV3BlockTopArticlesList;
}

/** Top articles 10-15: rows with the thumbnail on the left. */
const TopArticlesListBlock: React.FC<TopArticlesListBlockProps> = ({block}) => {
  const {articles_list: articles} = block.data;

  if (!articles?.length) {
    return null;
  }

  return (
    <View style={styles.root}>
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} thumbnail="left" thumbnailWidth={120} />
      ))}
    </View>
  );
};

export default TopArticlesListBlock;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 8,
    gap: 32,
  },
});
