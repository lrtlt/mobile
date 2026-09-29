import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HomeV3BlockArticle} from '../../../../../../api/Types';
import {Text} from '../../../../../../components';
import {IMG_SIZE_L} from '../../../../../../util/ImageUtil';
import ArticleHero from '../../components/ArticleHero';
import MoreButton from '../../components/MoreButton';
import useArticlePress from '../../components/useArticlePress';
import useHomeColors from '../../components/useHomeColors';

interface ExclusiveArticleBlockProps {
  block: HomeV3BlockArticle;
}

/** One article with its summary and a "Skaityti" button on a grey panel (template 64). */
const ExclusiveArticleBlock: React.FC<ExclusiveArticleBlockProps> = ({block}) => {
  const {article} = block.data;
  const colors = useHomeColors();
  const onPress = useArticlePress();

  if (!article) {
    return null;
  }

  const summary = article.summary?.trim();

  return (
    <View style={{...styles.root, backgroundColor: colors.sectionBackground}}>
      <ArticleHero article={article} imageSize={IMG_SIZE_L} alwaysShowBadges />
      {summary ? (
        <Text style={{...styles.summary, color: colors.description}} numberOfLines={3}>
          {summary}
        </Text>
      ) : null}
      <MoreButton title="Skaityti" style={styles.button} onPress={() => onPress(article)} />
    </View>
  );
};

export default ExclusiveArticleBlock;

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 8,
    padding: 16,
  },
  summary: {
    fontSize: 14.5,
    lineHeight: 18,
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
});
