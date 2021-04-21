import React, {useCallback, useState} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

import CoverImage from '../../coverImage/CoverImage';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import MediaIndicator from '../../mediaIndicator/MediaIndicator';

import {CameraIcon, MicIcon} from '../../svg';

import {getImageSizeForWidth, buildImageUri, buildArticleImageUri} from '../../../util/ImageUtil';
import {useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';
import {Article} from '../../../../Types';
import ArticleBadges from './ArticleBadges';
import ListenCount from './ListenCount';

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

  const mediaIcon = Boolean(article.is_audio) ? (
    <View style={style.mediaIconContainer}>
      <MicIcon size={18} />
    </View>
  ) : article.is_video ? (
    <View style={style.mediaIconContainer}>
      <CameraIcon size={18} />
    </View>
  ) : undefined;

  const mediaDuration = Boolean(article.media_duration) && (
    <TextComponent style={{...style.mediaDurationText, color: '#333'}}>
      {article.media_duration}
    </TextComponent>
  );

  let imgUri = undefined;
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
            style={{
              ...style.imageContainer,
              backgroundColor: colors.greyBackground,
              borderRadius: article.is_audio ? 8 : 0,
              overflow: 'hidden',
            }}
            onLayout={(event) => {
              const {width, height} = event.nativeEvent.layout;
              setDimensions({width: width, height: height});
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

          <TextComponent style={style.title}>{article.title}</TextComponent>
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
    borderRadius: 8,
  },
  image: {
    flex: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    justifyContent: 'center',
    aspectRatio: 3 / 2,
  },
  categoryTitle: {
    fontSize: 13.5,
    paddingEnd: 6,
    fontFamily: 'SourceSansPro-Regular',
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
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 22,
  },
  subtitle: {
    fontFamily: 'SourceSansPro-Regular',
    marginTop: 4,
    fontSize: 14,
  },
  mediaIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  mediaDurationText: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingVertical: 1,
    paddingHorizontal: 8,
    fontFamily: 'SourceSansPro-Regular',
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
    flex: 1,
    width: 300,
  },
  title: {
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 19,
  },
};

const stylesMulti = {
  ...styles,
  title: {
    marginTop: 8,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 17,
  },
};
