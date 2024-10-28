import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Article} from '../../../../Types';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {buildArticleImageUri, buildImageUri, IMG_SIZE_S} from '../../../util/ImageUtil';
import CoverImage from '../../coverImage/CoverImage';
import ArticleBadges from '../article/ArticleBadges';
import Badge from '../../badge/Badge';

interface Props {
  article: Article;
  onPress: (article: Article) => void;
}

const ArticleFeedItem: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {article, onPress} = props;

  const onPressHandler = useCallback(() => {
    onPress(article);
  }, [article, onPress]);

  let imgUri;
  if (article.img_path_prefix && article.img_path_postfix) {
    imgUri = buildImageUri(IMG_SIZE_S, article.img_path_prefix, article.img_path_postfix);
  } else if (article.photo) {
    imgUri = buildArticleImageUri(IMG_SIZE_S, article.photo);
  }

  const date = Boolean(article.item_date) ? (
    <TextComponent style={styles.categoryTitle} type="secondary">
      {article.item_date}
    </TextComponent>
  ) : null;

  const badge = Boolean(article.badge_title) && (
    <Badge style={{marginTop: 2}} label={article.badge_title!!} type={article.badge_class} size="small" />
  );

  return (
    <TouchableDebounce onPress={onPressHandler} debounceTime={500} activeOpacity={0.4}>
      <View style={{flexDirection: 'row'}}>
        <CoverImage
          style={{...styles.image, aspectRatio: article.photo_aspectratio}}
          source={{uri: imgUri}}
        />
        <View style={{...styles.container}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TextComponent style={styles.categoryTitle}>{article.category_title}</TextComponent>
            {date ? <View style={styles.dateContainer}>{date}</View> : null}
          </View>
          {badge}
          <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular">
            {article.title}
          </TextComponent>
          {Boolean(article.subtitle) && (
            <TextComponent style={styles.subtitle} type="error">
              {article.subtitle}
            </TextComponent>
          )}
          <ArticleBadges style={{paddingTop: 4}} article={article} />
        </View>
      </View>
    </TouchableDebounce>
  );
};

export default React.memo(ArticleFeedItem, (prevProps, nextProps) => {
  return prevProps.article.title === nextProps.article.title;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 4,
  },
  title: {
    fontSize: 15,
  },
  timeText: {
    marginTop: 4,
    fontSize: 13,
  },
  image: {
    width: 110,
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
