import React, {useCallback, useState} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

import CoverImage from '../../coverImage/CoverImage';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import MediaIndicator from '../../mediaIndicator/MediaIndicator';

import {getImageSizeForWidth, buildImageUri, buildArticleImageUri} from '../../../util/ImageUtil';
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

const ArticleComponent: React.FC<Props> = ({style: styleProp, article, styleType, dateEnabled, onPress}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const {colors} = useTheme();
  const style = getArticleStyle(styleType);

  const onPressHandler = useCallback(() => {
    onPress(article);
  }, [onPress, article]);

  const date = Boolean(article.date) && Boolean(dateEnabled) && (
    <TextComponent style={style.categoryTitle} type="secondary">
      {article.date}
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
  if (dimensions.width > 0) {
    if (article.img_path_prefix && article.img_path_postfix) {
      imgUri = buildImageUri(
        getImageSizeForWidth(dimensions.width),
        article.img_path_prefix,
        article.img_path_postfix,
      );
    } else if (article.photo) {
      imgUri = buildArticleImageUri(getImageSizeForWidth(dimensions.width), article.photo);
    }
  }

  return (
    <View style={[styleProp, style.container]}>
      <TouchableDebounce debounceTime={500} onPress={onPressHandler}>
        <View>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...style.imageContainer,
              backgroundColor: colors.greyBackground,
              borderRadius: article.is_audio ? 8 : 0,
            }}
            onLayout={(event) => {
              setDimensions(event.nativeEvent.layout);
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
            <TextComponent style={style.categoryTitle} type="secondary">
              {article.category_title}
            </TextComponent>
          </View>
          <View style={style.dateContainer}>{date}</View>
          {badge}
          <TextComponent style={style.title} fontFamily="PlayfairDisplay-Regular">
            {article.title}
          </TextComponent>
          <ArticleBadges style={style.badges} article={article} />
          {Boolean(article.subtitle) && (
            <TextComponent style={style.subtitle} type="error">
              {article.subtitle}
            </TextComponent>
          )}
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default React.memo(ArticleComponent, (prevProps, nextProps) => {
  return (
    prevProps.styleType === nextProps.styleType &&
    prevProps.article.title === nextProps.article.title &&
    prevProps.article.subtitle === nextProps.article.subtitle
  );
});

ArticleComponent.defaultProps = {
  dateEnabled: true,
};

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
    fontSize: 13.5,
    paddingEnd: 6,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    paddingTop: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateContainer: {
    flexDirection: 'row',
    paddingTop: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  title: {
    marginTop: 4,
    fontSize: 22,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
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
  mediaIconContainer: {
    paddingEnd: 8,
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
    width: 300,
  },
  title: {
    ...styles.title,
    fontSize: 19,
  },
};

const stylesMulti = {
  ...styles,
  title: {
    ...styles.title,
    fontSize: 17,
  },
};
