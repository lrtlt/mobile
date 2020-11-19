import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

import CoverImage from '../../coverImage/CoverImage';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import PhotoCountBadge from '../../photoCount/PhotoCount';
import FacebookReactions from '../../facebookReactions/FacebookReactions';
import MediaIndicator from '../../mediaIndicator/MediaIndicator';

import PropTypes from 'prop-types';

import {CameraIcon, MicIcon} from '../../svg';

import {getImageSizeForWidth, buildImageUri, buildArticleImageUri} from '../../../util/ImageUtil';
import {useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';

const getArticleStyle = (type) => {
  switch (type) {
    case 'single':
      return styles;
    case 'scroll':
      return stylesScroll;
    default:
      return stylesMulti;
  }
};

const Article = (props) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const {colors} = useTheme();

  const style = getArticleStyle(props.type);

  const subtitle = props.data.subtitle ? (
    <TextComponent style={style.subtitle} type="error">
      {props.data.subtitle}
    </TextComponent>
  ) : null;

  const date =
    props.data.date && props.showDate === true ? (
      <TextComponent style={style.categoryTitle} type="secondary">
        {props.data.date}
      </TextComponent>
    ) : null;

  const photoCount =
    props.data.photo && String(props.data.photo).length < 10 ? (
      <View>
        <PhotoCountBadge style={style.photoBadge} count={props.data.photo_count} />
      </View>
    ) : null;

  const facebookReactions = props.data.reactions ? (
    props.data.fb_badge === 1 ? (
      <FacebookReactions count={props.data.reactions} />
    ) : null
  ) : null;

  const space = photoCount && facebookReactions ? <View style={style.badgeSpace} /> : null;

  const mediaIndicator =
    props.data.is_video === 1 || props.data.is_audio === 1 ? (
      <MediaIndicator style={style.mediaIndicator} />
    ) : null;

  const mediaIcon =
    props.data.is_video === 1 ? (
      <View style={style.mediaIconContainer}>
        <CameraIcon size={20} />
      </View>
    ) : props.data.is_audio === 1 ? (
      <View style={style.mediaIconContainer}>
        <MicIcon size={20} />
      </View>
    ) : null;

  let imgUri = null;
  if (dimensions.width > 0) {
    if (props.data.img_path_prefix && props.data.img_path_postfix) {
      imgUri = buildImageUri(
        getImageSizeForWidth(dimensions.width),
        props.data.img_path_prefix,
        props.data.img_path_postfix,
      );
    } else if (props.data.photo) {
      imgUri = buildArticleImageUri(getImageSizeForWidth(dimensions.width), props.data.photo);
    }
  }

  return (
    <View style={[props.style, style.container]}>
      <TouchableDebounce debounceTime={500} onPress={() => props.onPress(props.data)}>
        <View>
          <View
            style={{...style.imageContainer, backgroundColor: colors.greyBackground}}
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
          </View>
          <View style={style.categoryTitleContainer}>
            {mediaIcon}
            <TextComponent style={style.categoryTitle} type="secondary">
              {props.data.category_title}
            </TextComponent>
          </View>
          <View style={style.dateContainer}>{date}</View>

          <TextComponent style={style.title}>{props.data.title}</TextComponent>
          <View style={style.bottomBadgeRow}>
            {photoCount}
            {space}
            {facebookReactions}
          </View>
          {subtitle}
        </View>
      </TouchableDebounce>
    </View>
  );
};

Article.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  showDate: PropTypes.bool,
};

export default Article;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
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
    marginTop: 2,
    fontSize: 14,
  },
  mediaIndicator: {
    width: 36,
    height: 36,
    position: 'absolute',
    alignSelf: 'center',
    paddingStart: 4,
    borderRadius: 36 / 2,
  },
  bottomBadgeRow: {
    width: '100%',
    paddingTop: 8,
    flexDirection: 'row',
  },
  photoBadge: {
    borderRadius: 4,
  },
  badgeSpace: {
    width: 8,
  },
  mediaIconContainer: {
    paddingEnd: 8,
  },
});

const stylesScroll = {
  ...styles,
  container: {
    width: Math.min(Dimensions.get('window').width, Dimensions.get('window').height) * 0.7,
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
