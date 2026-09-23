import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeV3BlockSlug} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {buildArticleImageUri, IMG_SIZE_L, IMG_SIZE_M} from '../../../../../../util/ImageUtil';
import ArticleImage from '../../components/ArticleImage';
import ArticleInfo from '../../components/ArticleInfo';
import ArticleTitle from '../../components/ArticleTitle';
import ArticleSubtitle from '../../components/ArticleSubtitle';
import MoreButton from '../../components/MoreButton';
import SectionTitle from '../../components/SectionTitle';
import useArticlePress from '../../components/useArticlePress';
import useHomeColors from '../../components/useHomeColors';
import {hasImage} from '../../util';

// The web tints the topic image with black and then blue, both at 60%.
const DIM_OVERLAY = 'rgba(0, 0, 0, 0.6)';
const TINT_OVERLAY = 'rgba(0, 132, 255, 0.6)';

interface SlugBannerBlockProps {
  block: HomeV3BlockSlug;
}

/** Topic on a full width background image with one article in a white card (template 63). */
const SlugBannerBlock: React.FC<SlugBannerBlockProps> = ({block}) => {
  const {slug_title, slug_url, articles_list: articles} = block.data;
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const colors = useHomeColors();
  const onArticlePress = useArticlePress();

  const onHeaderPress = useCallback(() => {
    navigation.navigate('Slug', {name: slug_title, slugUrl: slug_url});
  }, [navigation, slug_title, slug_url]);

  const article = articles?.[0];
  if (!article) {
    return null;
  }

  const backgroundUri = buildArticleImageUri(IMG_SIZE_L, block.background_image);

  return (
    <View style={styles.root}>
      {backgroundUri ? (
        <FastImage style={StyleSheet.absoluteFill} source={{uri: backgroundUri}} resizeMode="cover" />
      ) : null}
      <View style={[StyleSheet.absoluteFill, styles.dim]} />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      <SectionTitle title={slug_title} color="#FFFFFF" onPress={onHeaderPress} />
      <View style={{backgroundColor: colors.cardBackground}}>
        <TouchableDebounce
          onPress={() => onArticlePress(article)}
          accessibilityRole="link"
          activeOpacity={0.8}>
          <View style={styles.article}>
            {hasImage(article) ? <ArticleImage article={article} imageSize={IMG_SIZE_M} /> : null}
            <ArticleInfo article={article} absoluteDate />
            <ArticleTitle article={article} fontSize={18} lineHeight={22} />
            <ArticleSubtitle article={article} />
          </View>
        </TouchableDebounce>
        <MoreButton variant="light" onPress={onHeaderPress} />
      </View>
    </View>
  );
};

export default SlugBannerBlock;

const styles = StyleSheet.create({
  root: {
    padding: 16,
    gap: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  dim: {
    backgroundColor: DIM_OVERLAY,
  },
  tint: {
    backgroundColor: TINT_OVERLAY,
  },
  article: {
    padding: 16,
    gap: 8,
  },
});
