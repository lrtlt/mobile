import React, {useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View, useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {HomeV3Article, HomeV3BlockArticlesList} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {IMG_SIZE_S} from '../../../../../../util/ImageUtil';
import ArticleImage from '../../components/ArticleImage';
import ArticleInfo from '../../components/ArticleInfo';
import ArticleTitle from '../../components/ArticleTitle';
import ArticleSubtitle from '../../components/ArticleSubtitle';
import ArticleBadge from '../../components/ArticleBadge';
import MoreButton from '../../components/MoreButton';
import SectionTitle from '../../components/SectionTitle';
import useArticlePress from '../../components/useArticlePress';
import useHomeColors from '../../components/useHomeColors';
import {openMoreUrl} from '../../util';
import RankNumber from './RankNumber';

const ROOT_MARGIN = 8;
const LIST_PADDING = 16;
const CARD_GAP = 8;
/** Every whole card must be at least this wide; the leftover space fits one more half card. */
const MIN_CARD_WIDTH = 280;
const IMAGE_BLUR_RADIUS = 3;
const TEXT_BLUR_OFFSETS = [1.5, 3].flatMap((radius) =>
  [0, 45, 90, 135, 180, 225, 270, 315].map((degrees) => {
    const angle = (degrees * Math.PI) / 180;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  }),
);

/**
 * Sizes cards so a half card always peeks at the right edge, hinting that the row scrolls:
 * 1.5 cards on phones, 2.5 on tablets, 3.5+ on wider screens.
 */
const getCardWidth = (listWidth: number) => {
  const viewport = listWidth - LIST_PADDING;
  const wholeCards = Math.max(1, Math.floor(viewport / MIN_CARD_WIDTH));
  return (viewport - wholeCards * CARD_GAP) / (wholeCards + 0.5);
};

interface CardContentProps {
  article: HomeV3Article;
}

const CardText: React.FC<CardContentProps> = ({article}) => (
  <View style={styles.card}>
    <ArticleInfo article={article} />
    <ArticleTitle article={article} numberOfLines={4} />
    <ArticleSubtitle article={article} />
    {article.badge_title ? <ArticleBadge article={article} /> : null}
  </View>
);

const BlurredCardContent: React.FC<CardContentProps> = ({article}) => (
  <>
    <ArticleImage
      article={article}
      imageSize={IMG_SIZE_S}
      showBadges={false}
      blurRadius={IMAGE_BLUR_RADIUS}
    />
    <View>
      <View style={styles.hidden}>
        <CardText article={article} />
      </View>
      {TEXT_BLUR_OFFSETS.map(([translateX, translateY]) => (
        <View
          key={`${translateX},${translateY}`}
          style={[styles.textBlurLayer, {transform: [{translateX}, {translateY}]}]}>
          <CardText article={article} />
        </View>
      ))}
    </View>
  </>
);

interface MostReadBlockProps {
  block: HomeV3BlockArticlesList;
}

/** "Skaitomiausi per 24 val.": numbered horizontal cards on a grey panel. */
const MostReadBlock: React.FC<MostReadBlockProps> = ({block}) => {
  const {title, url, articles_list: articles} = block.data;
  const colors = useHomeColors();
  const onPress = useArticlePress();
  const {width: windowWidth} = useWindowDimensions();
  // Measured list width (excludes safe area and parent paddings). Until the first layout
  // pass, estimate from the window so the block does not jump in height.
  const [listWidth, setListWidth] = useState<number>();
  const cardWidth = getCardWidth(listWidth ?? windowWidth - ROOT_MARGIN * 2);

  const onListLayout = (e: LayoutChangeEvent) => {
    const {width} = e.nativeEvent.layout;
    setListWidth((prev) => (prev === width ? prev : width));
  };

  if (!articles?.length) {
    return null;
  }

  return (
    <View style={{...styles.root, backgroundColor: colors.sectionBackground}}>
      <SectionTitle style={styles.title} title={title} onPress={() => openMoreUrl(url)} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onLayout={onListLayout}>
        {articles.map((article, index) =>
          article._MORE_BUTTON ? (
            <View key={article.id} style={{width: cardWidth}}>
              <View
                style={[styles.card, styles.blurredCard]}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants">
                <BlurredCardContent article={article} />
              </View>
              <MoreButton
                style={styles.moreButton}
                title={article._MORE_BUTTON_TITLE ?? undefined}
                onPress={() => openMoreUrl(article._MORE_BUTTON_URL ?? url)}
              />
            </View>
          ) : (
            <TouchableDebounce
              key={article.id}
              onPress={() => onPress(article)}
              accessibilityRole="link"
              activeOpacity={0.8}>
              <View style={{...styles.card, width: cardWidth}}>
                <ArticleImage article={article} imageSize={IMG_SIZE_S} showBadges={false}>
                  <RankNumber rank={index + 1} />
                </ArticleImage>
                <CardText article={article} />
              </View>
            </TouchableDebounce>
          ),
        )}
      </ScrollView>
    </View>
  );
};

export default MostReadBlock;

const styles = StyleSheet.create({
  root: {
    marginHorizontal: ROOT_MARGIN,
    paddingVertical: 16,
  },
  title: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  list: {
    paddingHorizontal: LIST_PADDING,
    gap: CARD_GAP,
  },
  card: {
    gap: 8,
  },
  blurredCard: {
    opacity: 0.32,
  },
  hidden: {
    opacity: 0,
  },
  textBlurLayer: {
    ...StyleSheet.absoluteFill,
    opacity: 0.12,
  },
  moreButton: {
    position: 'absolute',
    top: '28%',
    alignSelf: 'center',
  },
});
