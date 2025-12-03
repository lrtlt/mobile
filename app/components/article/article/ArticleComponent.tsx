import React, {useCallback} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

import CoverImage from '../../coverImage/CoverImage';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import MediaIndicator from '../../mediaIndicator/MediaIndicator';

import {IMG_SIZE_M, IMG_SIZE_S, getArticleImageUri} from '../../../util/ImageUtil';
import {themeLight, useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';
import {Article} from '../../../../Types';
import ArticleBadges from './ArticleBadges';
import ListenCount from './ListenCount';
import Badge from '../../badge/Badge';
import MediaIcon from '../../mediaIcon/MediaIcon';

import FastImage from '@d11/react-native-fast-image';
import {DEFAULT_ARTICLE_IMAGE} from '../../../constants';
import {IconSimple} from '../../svg';

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

const getArticleAspectRatio = (article: Article): number | undefined => {
  return Number(article?.img_w_h || article?.photo_aspectratio);
};

const ArticleComponent: React.FC<React.PropsWithChildren<Props>> = ({
  style: styleProp,
  article,
  styleType,
  dateEnabled = true,
  onPress,
}) => {
  const style = getArticleStyle(styleType);
  const {colors, simplyfied} = useTheme();

  // Safety check for article object
  if (!article) {
    return null;
  }

  const onPressHandler = useCallback(() => {
    if (typeof onPress === 'function' && article) {
      onPress(article);
    }
  }, [onPress, article]);

  const date = Boolean(article?.item_date) && Boolean(dateEnabled) && (
    <TextComponent style={style.categoryTitle} type="secondary" importantForAccessibility="no">
      {article.item_date}
    </TextComponent>
  );

  const mediaIndicator = (Boolean(article?.is_video) || Boolean(article?.is_audio)) && (
    <MediaIndicator style={style.mediaIndicator} size={styleType === 'single' ? 'big' : 'small'} />
  );

  const mediaIcon = (
    <MediaIcon
      style={styles.mediaIcon}
      size={18}
      is_video={article?.is_video}
      is_audio={article?.is_audio}
      channel_id={article?.channel_id}
    />
  );

  const mediaDuration = Boolean(article?.media_duration) && (
    <TextComponent
      style={{...style.mediaDurationText, color: themeLight.colors.text}}
      importantForAccessibility="no">
      {article.media_duration}
    </TextComponent>
  );

  const simpleIcon = simplyfied && (
    <View
      style={{
        backgroundColor: colors.primary,
        padding: 2,
        borderRadius: 2,
      }}>
      <IconSimple width={14} height={14} color={colors.onPrimary} />
    </View>
  );

  const badge = Boolean(article?.badge_title) && (
    <Badge style={style.badge} label={article.badge_title!} type={article?.badge_class} />
  );

  let imgUri = getArticleImageUri(article, styleType == 'single' ? IMG_SIZE_M : IMG_SIZE_S);

  const aspectRatio = getArticleAspectRatio(article);
  const isVerticalPhoto = aspectRatio && Number(aspectRatio) < 1;

  return (
    <View
      style={[
        style.container,
        styleProp,
        {
          marginVertical: simplyfied ? 16 : 0,
        },
      ]}>
      <TouchableDebounce
        debounceTime={500}
        onPress={onPressHandler}
        activeOpacity={0.8}
        accessibilityRole="link">
        <View style={{gap: 6}} accessible={false}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...style.imageContainer,
              backgroundColor: '#00000033',
              borderRadius: article?.is_audio ? 8 : 0,
            }}>
            <CoverImage
              style={style.image}
              source={{
                uri: imgUri ?? DEFAULT_ARTICLE_IMAGE,
              }}
              resizeMode={isVerticalPhoto ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
            />
            {mediaIndicator}

            {mediaDuration}
            <ListenCount style={style.listenCount} article={article} visible={styleType === 'single'} />
          </View>
          {!simplyfied && (
            <>
              <View style={style.categoryTitleContainer}>
                {mediaIcon}
                <TextComponent style={style.categoryTitle}>{article?.category_title || ''}</TextComponent>
                {date}
              </View>
              {badge}
            </>
          )}
          {simplyfied && <View style={{height: 16}} />}
          <TextComponent
            style={{
              ...style.title,
              fontSize: simplyfied ? 18 : style.title.fontSize,
            }}
            fontFamily="PlayfairDisplay-Regular">
            {simplyfied && simpleIcon}
            {simplyfied && ' '}
            {article?.title || ''}
          </TextComponent>
          {Boolean(article?.summary) && (
            <TextComponent style={style.subtitle} type="secondary" numberOfLines={3}>
              {article.summary}
            </TextComponent>
          )}
          {Boolean(article?.subtitle) && (
            <TextComponent style={style.subtitle} type="error">
              {article.subtitle}
            </TextComponent>
          )}
          {!simplyfied && <ArticleBadges style={style.badges} article={article} />}
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default React.memo(ArticleComponent, (prevProps, nextProps) => {
  return (
    prevProps.style === nextProps.style &&
    prevProps.styleType === nextProps.styleType &&
    prevProps.article?.title === nextProps.article?.title &&
    prevProps.article?.subtitle === nextProps.article?.subtitle &&
    prevProps.dateEnabled === nextProps.dateEnabled &&
    prevProps.onPress === nextProps.onPress
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
    fontSize: 22,
  },
  subtitle: {
    paddingTop: 4,
    fontSize: 14.5,
  },
  mediaIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  badge: {},
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

const stylesScroll = StyleSheet.create({
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
});

const stylesMulti = StyleSheet.create({
  ...styles,
  title: {
    ...styles.title,
    fontSize: 16,
  },
});
