import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Article} from '../../../../Types';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {getArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';
import CoverImage from '../../coverImage/CoverImage';
import ArticleBadges from '../article/ArticleBadges';
import Badge from '../../badge/Badge';
import MediaIcon from '../../mediaIcon/MediaIcon';
import {DEFAULT_ARTICLE_IMAGE} from '../../../constants';

interface Props {
  article: Article;
  onPress: (article: Article) => void;
}

const ArticleFeedItem: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {article, onPress} = props;

  const onPressHandler = useCallback(() => {
    onPress(article);
  }, [article, onPress]);

  const imgUri = getArticleImageUri(article, IMG_SIZE_M);

  const date = Boolean(article.item_date) ? (
    <TextComponent style={styles.categoryTitle} type="secondary">
      {article.item_date}
    </TextComponent>
  ) : null;

  const badge = Boolean(article.badge_title) && (
    <Badge style={{marginTop: 2}} label={article.badge_title!!} type={article.badge_class} size="small" />
  );

  const mediaIcon =
    article?.is_video || article?.is_audio ? (
      <View style={{paddingRight: 8}}>
        <MediaIcon
          size={13}
          is_video={article?.is_video}
          is_audio={article?.is_audio}
          channel_id={article?.channel_id}
        />
      </View>
    ) : undefined;

  return (
    <TouchableDebounce onPress={onPressHandler} debounceTime={500} activeOpacity={0.4}>
      <View style={{flexDirection: 'row'}}>
        <CoverImage style={{...styles.image}} source={{uri: imgUri ?? DEFAULT_ARTICLE_IMAGE}} />
        <View style={{...styles.container}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {date ? <View style={styles.dateContainer}>{date}</View> : null}
          </View>
          {badge}
          <TextComponent style={styles.title} numberOfLines={3} fontFamily="PlayfairDisplay-Regular">
            {mediaIcon ? mediaIcon : ''}
            {article.title}
          </TextComponent>
          {Boolean(article.subtitle) && (
            <TextComponent style={styles.subtitle} type="error">
              {article.subtitle}
            </TextComponent>
          )}
          <ArticleBadges style={{paddingTop: 4}} article={article} />

          <TextComponent style={styles.categoryTitle}>{article.category_title}</TextComponent>
        </View>
      </View>
    </TouchableDebounce>
  );
};

export default ArticleFeedItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    gap: 2,
  },
  title: {
    fontSize: 17.5,
  },
  timeText: {
    fontSize: 13,
  },
  image: {
    width: 110,
    aspectRatio: 1,
  },
  categoryTitle: {
    fontSize: 12,
    paddingEnd: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
  },
});
