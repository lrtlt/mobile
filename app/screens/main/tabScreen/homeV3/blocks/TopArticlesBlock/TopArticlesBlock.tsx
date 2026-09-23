import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HomeV3BlockTopArticles} from '../../../../../../api/Types';
import {IMG_SIZE_M, IMG_SIZE_XXL} from '../../../../../../util/ImageUtil';
import ArticleHero from '../../components/ArticleHero';
import ArticleListItem from '../../components/ArticleListItem';
import useHomeColors from '../../components/useHomeColors';

interface TopArticlesBlockProps {
  block: HomeV3BlockTopArticles;
}

/** Top 9: one hero article, a two-column pair and a list with small thumbnails. */
const TopArticlesBlock: React.FC<TopArticlesBlockProps> = ({block}) => {
  const {articles_list: articles} = block.data;
  const colors = useHomeColors();

  if (!articles?.length) {
    return null;
  }

  const [hero, ...rest] = articles;
  const pair = rest.slice(0, 2);
  const list = rest.slice(2);

  return (
    <View style={styles.root}>
      <ArticleHero article={hero} imageSize={IMG_SIZE_XXL} />
      {pair.length > 0 ? (
        <View style={styles.pair}>
          {pair.map((article) => (
            <ArticleHero
              key={article.id}
              style={styles.pairItem}
              article={article}
              titleSize="small"
              imageSize={IMG_SIZE_M}
            />
          ))}
          {pair.length === 1 ? <View style={styles.pairItem} /> : null}
        </View>
      ) : null}
      {list.length > 0 ? (
        <View>
          {list.map((article, index) => (
            <ArticleListItem
              key={article.id}
              article={article}
              style={index === 0 ? styles.listItemFirst : {...styles.listItem, borderColor: colors.separator}}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default TopArticlesBlock;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 8,
    gap: 32,
  },
  pair: {
    flexDirection: 'row',
    gap: 12,
  },
  pairItem: {
    flex: 1,
  },
  listItemFirst: {
    paddingBottom: 16,
  },
  listItem: {
    paddingVertical: 16,
    borderTopWidth: 1,
  },
});
