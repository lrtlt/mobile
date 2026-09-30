import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {TouchableDebounce} from '../../../../../components';
import {HomeV3Article} from '../../../../../api/Types';
import {ImageSize, IMG_SIZE_L} from '../../../../../util/ImageUtil';
import {hasImage, isVideoArticle} from '../util';
import ArticleImage from './ArticleImage';
import ArticleInfo from './ArticleInfo';
import ArticleTitle from './ArticleTitle';
import ArticleSubtitle from './ArticleSubtitle';
import ArticleBadge from './ArticleBadge';
import KeywordTag from './KeywordTag';
import MediaCta, {MEDIA_ACCENTS} from './MediaCta';
import useArticlePress from './useArticlePress';

const TITLE_FONT_NAMES = {
  big: 'serifBold',
  medium: 'serif',
  small: 'sans',
} as const;

interface Props {
  article: HomeV3Article;
  titleSize?: keyof typeof TITLE_FONT_NAMES;
  imageSize?: ImageSize;
  showCategory?: boolean;
  absoluteDate?: boolean;
  alwaysShowBadges?: boolean;
  style?: ViewStyle;
}

/** Image on top, then info row, title in the font of its size (see titleFonts), badge and keyword tag. */
const ArticleHero: React.FC<Props> = ({
  article,
  titleSize = 'big',
  imageSize = IMG_SIZE_L,
  showCategory = true,
  absoluteDate,
  alwaysShowBadges,
  style,
}) => {
  const onPress = useArticlePress();

  const keyword =
    Boolean(article._with_first_keyword) && article._first_keyword ? article._first_keyword : undefined;

  // A video lead gets the player look: rounded 16:9 frame, duration and a "Žiūrėti" button.
  const isVideo = isVideoArticle(article);

  return (
    <View style={style}>
      <TouchableDebounce onPress={() => onPress(article)} accessibilityRole="link" activeOpacity={0.8}>
        <View style={styles.content}>
          {hasImage(article) ? (
            <ArticleImage
              article={article}
              imageSize={imageSize}
              aspectRatio={isVideo ? 16 / 9 : undefined}
              borderRadius={isVideo ? 8 : 0}
              showBadges={isVideo ? false : alwaysShowBadges ? 'always' : true}
              showDuration={isVideo}>
              {isVideo ? <MediaCta accent={MEDIA_ACCENTS.video} /> : null}
            </ArticleImage>
          ) : null}
          <ArticleInfo article={article} showCategory={showCategory} absoluteDate={absoluteDate} />
          <ArticleTitle article={article} font={TITLE_FONT_NAMES[titleSize]} playPrefix="none" />
          <ArticleSubtitle article={article} />
          {article.badge_title ? <ArticleBadge article={article} size="big" /> : null}
        </View>
      </TouchableDebounce>
      {keyword ? <KeywordTag keyword={keyword} /> : null}
    </View>
  );
};

export default ArticleHero;

const styles = StyleSheet.create({
  content: {
    gap: 8,
    marginBottom: 4,
  },
});
