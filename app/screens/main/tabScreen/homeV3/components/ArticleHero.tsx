import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text, TouchableDebounce} from '../../../../../components';
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
import useHomeColors from './useHomeColors';

const TITLE_SIZES = {
  big: {fontSize: 28, lineHeight: 32},
  medium: {fontSize: 24, lineHeight: 30},
  small: {fontSize: 20, lineHeight: 24},
};

interface Props {
  article: HomeV3Article;
  titleSize?: keyof typeof TITLE_SIZES;
  imageSize?: ImageSize;
  showCategory?: boolean;
  absoluteDate?: boolean;
  alwaysShowBadges?: boolean;
  style?: ViewStyle;
}

/** Image on top, then info row, serif title, badge, summary and keyword tag. */
const ArticleHero: React.FC<Props> = ({
  article,
  titleSize = 'big',
  imageSize = IMG_SIZE_L,
  showCategory = true,
  absoluteDate,
  alwaysShowBadges,
  style,
}) => {
  const colors = useHomeColors();
  const onPress = useArticlePress();

  const summary = Boolean(article._with_summary) && Boolean(article.summary) && (
    <Text style={{...styles.summary, color: colors.description}} numberOfLines={3}>
      {article.summary?.trim()}
    </Text>
  );

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
          <ArticleTitle article={article} serif playPrefix="none" {...TITLE_SIZES[titleSize]} />
          <ArticleSubtitle article={article} />
          {article.badge_title ? <ArticleBadge article={article} size="big" /> : null}
          {summary}
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
  summary: {
    fontSize: 18,
    lineHeight: 22,
    marginTop: 4,
    marginBottom: 12,
  },
});
