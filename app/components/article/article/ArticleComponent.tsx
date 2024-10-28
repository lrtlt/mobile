import React, {useCallback} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

import CoverImage from '../../coverImage/CoverImage';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import MediaIndicator from '../../mediaIndicator/MediaIndicator';

import {buildImageUri, buildArticleImageUri, IMG_SIZE_M, IMG_SIZE_S} from '../../../util/ImageUtil';
import {themeLight, useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';
import {Article} from '../../../../Types';
import ArticleBadges from './ArticleBadges';
import ListenCount from './ListenCount';
import Badge from '../../badge/Badge';
import MediaIcon from '../../mediaIcon/MediaIcon';

const getArticleStyle = (type: ArticleStyleType) => {
  switch (type) {
    case 'single':
      return styles;
    case 'scroll':
      return stylesScroll;
    default:
      return stylesMulti;
  }
};

export type ArticleStyleType = 'single' | 'scroll' | 'multi';

interface Props {
  style?: ViewStyle;
  article: Article;
  styleType: ArticleStyleType;
  dateEnabled?: boolean;
  onPress: (article: Article) => void;
}

const ArticleComponent: React.FC<React.PropsWithChildren<Props>> = ({
  style: styleProp,
  article,
  styleType,
  dateEnabled = true,
  onPress,
}) => {
  const {colors} = useTheme();
  const style = getArticleStyle(styleType);

  const onPressHandler = useCallback(() => {
    onPress(article);
  }, [onPress, article]);

  const date = Boolean(article.item_date) && Boolean(dateEnabled) && (
    <TextComponent style={style.categoryTitle} type="secondary">
      {article.item_date}
    </TextComponent>
  );

  const mediaIndicator = (Boolean(article.is_video) || Boolean(article.is_audio)) && (
    <MediaIndicator style={style.mediaIndicator} size={styleType === 'single' ? 'big' : 'small'} />
  );

  const mediaIcon = (
    <MediaIcon
      style={styles.mediaIcon}
      size={18}
      is_video={article.is_video}
      is_audio={article.is_audio}
      channel_id={article.channel_id}
    />
  );

  const mediaDuration = Boolean(article.media_duration) && (
    <TextComponent style={{...style.mediaDurationText, color: themeLight.colors.text}}>
      {article.media_duration}
    </TextComponent>
  );

  const badge = Boolean(article.badge_title) && (
    <Badge style={style.badge} label={article.badge_title!!} type={article.badge_class} />
  );

  let imgUri;
  if (article.img_path_prefix && article.img_path_postfix) {
    imgUri = buildImageUri(
      styleType === 'single' ? IMG_SIZE_M : IMG_SIZE_S,
      article.img_path_prefix,
      article.img_path_postfix,
    );
  } else if (article.photo) {
    imgUri = buildArticleImageUri(styleType === 'single' ? IMG_SIZE_M : IMG_SIZE_S, article.photo);
  }

  return (
    <View style={[style.container, styleProp]}>
      <TouchableDebounce debounceTime={500} onPress={onPressHandler} activeOpacity={0.8}>
        <View>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...style.imageContainer,
              backgroundColor: colors.greyBackground,
              borderRadius: article.is_audio ? 8 : 0,
            }}>
            <CoverImage
              style={style.image}
              source={{
                uri: imgUri,
              }}
            />
            {mediaIndicator}

            {mediaDuration}
            <ListenCount style={style.listenCount} article={article} visible={styleType === 'single'} />
          </View>
          <View style={style.categoryTitleContainer}>
            {mediaIcon}
            <TextComponent style={style.categoryTitle}>{article.category_title}</TextComponent>
            {date}
          </View>
          {badge}

          <TextComponent style={style.title} fontFamily="PlayfairDisplay-Regular">
            {article.title}
          </TextComponent>
          {Boolean(article.summary) && (
            <TextComponent style={style.subtitle} type="secondary" numberOfLines={3}>
              {article.summary}
            </TextComponent>
          )}
          {Boolean(article.subtitle) && (
            <TextComponent style={style.subtitle} type="error">
              {article.subtitle}
            </TextComponent>
          )}
          <ArticleBadges style={style.badges} article={article} />
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default React.memo(ArticleComponent, (prevProps, nextProps) => {
  return (
    prevProps.style === nextProps.style &&
    prevProps.styleType === nextProps.styleType &&
    prevProps.article.title === nextProps.article.title &&
    prevProps.article.subtitle === nextProps.article.subtitle
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    justifyContent: 'center',
    aspectRatio: 3 / 2,
    overflow: 'hidden',
  },
  mediaIcon: {
    marginEnd: 4,
  },
  categoryTitle: {
    fontSize: 12.5,
    paddingEnd: 6,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    marginTop: 4,
    fontSize: 22,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14.5,
  },
  mediaIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  badge: {
    marginTop: 2,
  },
  mediaDurationText: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingVertical: 1,
    paddingHorizontal: 8,

    fontSize: 13,
    backgroundColor: 'white',
  },
  badges: {
    paddingTop: 8,
  },
  listenCount: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
});

const stylesScroll = {
  ...styles,

  container: {
    ...styles.container,
    width: 280,
    padding: 8,
  },
  title: {
    ...styles.title,
    fontSize: 17,
  },
};

const stylesMulti = {
  ...styles,
  title: {
    ...styles.title,
    fontSize: 16,
  },
};
