import React, {useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View, useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {HomeV3BlockArticlesList} from '../../../../../../api/Types';
import {Text, TouchableDebounce} from '../../../../../../components';
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

const ROOT_MARGIN = 8;
const LIST_PADDING = 16;
const CARD_GAP = 8;
/** Every whole card must be at least this wide; the leftover space fits one more half card. */
const MIN_CARD_WIDTH = 280;

/**
 * Sizes cards so a half card always peeks at the right edge, hinting that the row scrolls:
 * 1.5 cards on phones, 2.5 on tablets, 3.5+ on wider screens.
 */
const getCardWidth = (listWidth: number) => {
  const viewport = listWidth - LIST_PADDING;
  const wholeCards = Math.max(1, Math.floor(viewport / MIN_CARD_WIDTH));
  return (viewport - wholeCards * CARD_GAP) / (wholeCards + 0.5);
};

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
    setListWidth(prev => (prev === width ? prev : width));
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
        {articles.map((article, index) => (
          <TouchableDebounce
            key={article.id}
            onPress={() => onPress(article)}
            accessibilityRole="link"
            activeOpacity={0.8}>
            <View style={{...styles.card, width: cardWidth}}>
              <ArticleImage article={article} imageSize={IMG_SIZE_S} showBadges={false}>
                {article._MORE_BUTTON ? (
                  <View style={styles.moreOverlay}>
                    <MoreButton
                      title={article._MORE_BUTTON_TITLE ?? undefined}
                      onPress={() => openMoreUrl(article._MORE_BUTTON_URL ?? url)}
                    />
                  </View>
                ) : (
                  <View style={{...styles.rank, backgroundColor: colors.cardBackground}}>
                    <Text
                      style={{...styles.rankText, color: colors.text}}
                      fontFamily="PlayfairDisplay-Regular"
                      scalingEnabled={false}>
                      {index + 1}
                    </Text>
                  </View>
                )}
              </ArticleImage>
              <ArticleInfo article={article} />
              <ArticleTitle article={article} fontSize={16} lineHeight={18} numberOfLines={4} />
              <ArticleSubtitle article={article} />
              {article.badge_title ? <ArticleBadge article={article} /> : null}
            </View>
          </TouchableDebounce>
        ))}
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
  rank: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 24,
    lineHeight: 30,
  },
  moreOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 3, 13, 0.3)',
  },
});
