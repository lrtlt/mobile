import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {Text} from '../../../../../components';
import {IconPhotoCamera, IconPlay} from '../../../../../components/svg';
import {HomeV3Article} from '../../../../../api/Types';
import {getArticleImageUri, ImageSize, IMG_SIZE_L} from '../../../../../util/ImageUtil';
import {hasPhotoBadges, isMediaArticle} from '../util';
import DurationBadge from './DurationBadge';
import useHomeColors from './useHomeColors';

const BADGE_TEXT_COLOR = '#02030D';

interface Props {
  article: HomeV3Article;
  /** Ready image url, for items whose image is not on lrt.lt (Epika). */
  imageUri?: string;
  imageSize?: ImageSize;
  aspectRatio?: number;
  borderRadius?: number;
  /**
   * Photo count and play badges in the bottom left corner. `true` follows the API's
   * `_view_badge` hint, 'always' shows them regardless.
   */
  showBadges?: boolean | 'always';
  /** Media duration in the top left corner. */
  showDuration?: boolean;
  style?: ViewStyle;
}

const ArticleImage: React.FC<React.PropsWithChildren<Props>> = ({
  article,
  imageUri,
  imageSize = IMG_SIZE_L,
  aspectRatio = 3 / 2,
  borderRadius = 0,
  showBadges = true,
  showDuration = false,
  style,
  children,
}) => {
  const colors = useHomeColors();
  const uri = imageUri ?? getArticleImageUri(article, imageSize);

  const photoCount = Number(article.photo_count ?? 0);
  // A single photo is not a gallery, the web shows no counter for it.
  const hasGallery = photoCount > 1;
  const badgesVisible = showBadges === 'always' || (showBadges && hasPhotoBadges(article));
  const hasPlay = Boolean(article.article_has_audiovideo) || isMediaArticle(article);

  const durationVisible = showDuration && Boolean(article.media_duration) && !article.no_duration_badge;

  return (
    <View
      style={[styles.container, {aspectRatio, borderRadius, backgroundColor: colors.photoBackground}, style]}>
      {uri ? <FastImage style={StyleSheet.absoluteFill} source={{uri}} resizeMode="cover" /> : null}
      {badgesVisible && (hasGallery || hasPlay) ? (
        <View style={styles.badges} importantForAccessibility="no-hide-descendants">
          {hasGallery ? (
            <View style={styles.badge}>
              <IconPhotoCamera size={14} color={BADGE_TEXT_COLOR} />
              <Text style={styles.badgeText} fontFamily="SourceSansPro-SemiBold" scalingEnabled={false}>
                {photoCount}
              </Text>
            </View>
          ) : null}
          {hasPlay ? (
            <View style={styles.badge}>
              <IconPlay size={11} color={BADGE_TEXT_COLOR} />
            </View>
          ) : null}
        </View>
      ) : null}
      {durationVisible ? <DurationBadge duration={article.media_duration!} /> : null}
      {children}
    </View>
  );
};

export default ArticleImage;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  badges: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    height: 26,
    minWidth: 28,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 12,
    color: BADGE_TEXT_COLOR,
  },
});
