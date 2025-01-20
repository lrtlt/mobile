import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Article} from '../../../../Types';
import FacebookReactions from '../../facebookReactions/FacebookReactions';
import PhotoCountBadge from '../../photoCount/PhotoCount';

interface ArticleBadgesProps {
  style?: ViewStyle;
  article: Article;
}

const ArticleBadges: React.FC<ArticleBadgesProps> = ({style, article}) => {
  const photoCount = Boolean(article.photo) && String(article.photo).length < 10 && (
    <View>
      <PhotoCountBadge style={styles.photoBadge} count={article.photo_count} />
    </View>
  );

  const facebookReactions = Boolean(article.reactions) && Boolean(article.fb_badge) && (
    <FacebookReactions count={article.reactions} />
  );

  return (
    <View style={[styles.container, style]} importantForAccessibility="no">
      {photoCount}
      {photoCount && facebookReactions && <View style={styles.badgeSpace} />}
      {facebookReactions}
    </View>
  );
};

export default ArticleBadges;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  photoBadge: {
    borderRadius: 4,
  },
  badgeSpace: {
    width: 8,
  },
});
