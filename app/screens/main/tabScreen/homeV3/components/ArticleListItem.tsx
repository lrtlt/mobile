import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {TouchableDebounce} from '../../../../../components';
import {IconPlay} from '../../../../../components/svg';
import {HomeV3Article} from '../../../../../api/Types';
import {IMG_SIZE_XS} from '../../../../../util/ImageUtil';
import {hasImage, isVideoArticle} from '../util';
import ArticleImage from './ArticleImage';
import ArticleInfo from './ArticleInfo';
import ArticleTitle from './ArticleTitle';
import ArticleSubtitle from './ArticleSubtitle';
import ArticleBadge from './ArticleBadge';
import useArticlePress from './useArticlePress';
import useHomeColors from './useHomeColors';

interface Props {
  article: HomeV3Article;
  /** Where the thumbnail goes. Articles the API marks with `_skip_image` never get one. */
  thumbnail?: 'left' | 'right' | 'none';
  thumbnailWidth?: number;
  thumbnailRadius?: number;
  thumbnailAspectRatio?: number;
  showCategory?: boolean;
  titleFontSize?: number;
  titleLineHeight?: number;
  numberOfLines?: number;
  style?: ViewStyle;
}

/** Text article row: info, title, badge, with an optional thumbnail on either side. */
const ArticleListItem: React.FC<Props> = ({
  article,
  thumbnail = 'right',
  thumbnailWidth = 90,
  thumbnailRadius = 0,
  thumbnailAspectRatio = 3 / 2,
  showCategory = true,
  titleFontSize = 18,
  titleLineHeight = 22,
  numberOfLines,
  style,
}) => {
  const colors = useHomeColors();
  const onPress = useArticlePress();

  const image = thumbnail !== 'none' && hasImage(article) && (
    <ArticleImage
      article={article}
      imageSize={IMG_SIZE_XS}
      aspectRatio={thumbnailAspectRatio}
      borderRadius={thumbnailRadius}
      showBadges={false}
      style={{width: thumbnailWidth}}
    />
  );

  // Video articles carry the play mark in front of the title instead.
  const hasPlayBadge = Boolean(article.article_has_audiovideo) && !isVideoArticle(article);

  return (
    <TouchableDebounce onPress={() => onPress(article)} accessibilityRole="link" activeOpacity={0.8}>
      <View style={[styles.container, style]}>
        {thumbnail === 'left' ? image : null}
        <View style={styles.content}>
          <ArticleInfo article={article} showCategory={showCategory} />
          <ArticleTitle
            article={article}
            fontSize={titleFontSize}
            lineHeight={titleLineHeight}
            numberOfLines={numberOfLines}
          />
          <ArticleSubtitle article={article} />
          {article.badge_title ? <ArticleBadge article={article} /> : null}
          {hasPlayBadge ? (
            <View style={{...styles.playBadge, backgroundColor: colors.smallBadge}}>
              <IconPlay size={8} color={colors.text} />
            </View>
          ) : null}
        </View>
        {thumbnail === 'right' ? image : null}
      </View>
    </TouchableDebounce>
  );
};

export default ArticleListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  playBadge: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingStart: 1,
  },
});
