import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeV3Article, HomeV3BlockSlug} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
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
  block: HomeV3BlockSlug;
}

/** Topic with a featured article and a 2x2 grid below (template 18). */
const SlugFeaturedBlock: React.FC<SlugFeaturedBlockProps> = ({block}) => {
  const {slug_title, slug_url, articles_list: articles} = block.data;
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const onHeaderPress = useCallback(() => {
    navigation.navigate('Slug', {name: slug_title, slugUrl: slug_url});
  }, [navigation, slug_title, slug_url]);

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
      <SectionTitle title={slug_title} onPress={onHeaderPress} />
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
