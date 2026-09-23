import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeV3Article, HomeV3BlockCategory, HomeV3BlockSlug} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {useNavigationStore} from '../../../../../../state/navigation_store';
import {IMG_SIZE_L, IMG_SIZE_S} from '../../../../../../util/ImageUtil';
import ArticleHero from '../../components/ArticleHero';
import ArticleImage from '../../components/ArticleImage';
import ArticleInfo from '../../components/ArticleInfo';
import ArticleTitle from '../../components/ArticleTitle';
import ArticleSubtitle from '../../components/ArticleSubtitle';
import ArticleBadge from '../../components/ArticleBadge';
import MoreButton from '../../components/MoreButton';
import SectionTitle from '../../components/SectionTitle';
import useArticlePress from '../../components/useArticlePress';
import {hasImage, isVideoArticle} from '../../util';

interface SlugFeaturedBlockProps {
  block: HomeV3BlockSlug | HomeV3BlockCategory;
}

/** Topic (or category) with a featured article and a 2x2 grid below (template 18). */
const SlugFeaturedBlock: React.FC<SlugFeaturedBlockProps> = ({block}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const title = block.type === 'slug' ? block.data.slug_title : block.data.category_title;
  const articles = block.data.articles_list;

  const onHeaderPress = useCallback(() => {
    if (block.type === 'slug') {
      navigation.navigate('Slug', {name: block.data.slug_title, slugUrl: block.data.slug_url});
    } else {
      useNavigationStore.getState().openCategoryById(block.data.category_id, block.data.category_title);
    }
  }, [block, navigation]);

  if (!articles?.length) {
    return null;
  }

  const [hero, ...rest] = articles;
  const rows: HomeV3Article[][] = [];
  for (let i = 0; i < Math.min(rest.length, 4); i += 2) {
    rows.push(rest.slice(i, i + 2));
  }

  return (
    <View style={styles.root}>
      <SectionTitle title={title} onPress={onHeaderPress} />
      <ArticleHero article={hero} imageSize={IMG_SIZE_L} />
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((article) => (
            <GridItem key={article.id} article={article} />
          ))}
          {row.length === 1 ? <View style={styles.rowItem} /> : null}
        </View>
      ))}
      <MoreButton onPress={onHeaderPress} />
    </View>
  );
};

const GridItem: React.FC<{article: HomeV3Article}> = ({article}) => {
  const onPress = useArticlePress();
  const isVideo = isVideoArticle(article);

  return (
    <TouchableDebounce
      style={styles.rowItem}
      onPress={() => onPress(article)}
      accessibilityRole="link"
      activeOpacity={0.8}>
      <View style={styles.gridItem}>
        {hasImage(article) ? (
          <ArticleImage
            article={article}
            imageSize={IMG_SIZE_S}
            aspectRatio={isVideo ? 16 / 9 : 3 / 2}
            borderRadius={isVideo ? 8 : 0}
            showDuration={isVideo}
          />
        ) : null}
        <ArticleInfo article={article} />
        <ArticleTitle article={article} fontSize={18} lineHeight={22} />
        <ArticleSubtitle article={article} />
        {article.badge_title ? <ArticleBadge article={article} /> : null}
      </View>
    </TouchableDebounce>
  );
};

export default SlugFeaturedBlock;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 8,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  rowItem: {
    flex: 1,
  },
  gridItem: {
    gap: 8,
  },
});
