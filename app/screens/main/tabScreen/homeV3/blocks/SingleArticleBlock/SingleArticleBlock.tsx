import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {HomeV3BlockCategory} from '../../../../../../api/Types';
import {useNavigationStore} from '../../../../../../state/navigation_store';
import {IMG_SIZE_L} from '../../../../../../util/ImageUtil';
import ArticleHero from '../../components/ArticleHero';
import SectionTitle from '../../components/SectionTitle';
import useHomeColors from '../../components/useHomeColors';

interface SingleArticleBlockProps {
  block: HomeV3BlockCategory;
}

/** One highlighted article in a card on a grey panel, e.g. "LRT tyrimai" (template 16). */
const SingleArticleBlock: React.FC<SingleArticleBlockProps> = ({block}) => {
  const {category_id, category_title, articles_list: articles} = block.data;
  const colors = useHomeColors();

  const onHeaderPress = useCallback(() => {
    useNavigationStore.getState().openCategoryById(category_id, category_title);
  }, [category_id, category_title]);

  const article = articles?.[0];
  if (!article) {
    return null;
  }

  return (
    <View style={{...styles.root, backgroundColor: colors.sectionBackground}}>
      <View style={{...styles.card, backgroundColor: colors.cardBackground}}>
        <SectionTitle title={category_title} onPress={onHeaderPress} />
        <ArticleHero
          article={article}
          titleSize="medium"
          imageSize={IMG_SIZE_L}
          absoluteDate
          alwaysShowBadges
        />
      </View>
    </View>
  );
};

export default SingleArticleBlock;

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 8,
    padding: 16,
  },
  card: {
    padding: 16,
    gap: 16,
  },
});
