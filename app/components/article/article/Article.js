import React, { useState } from 'react';
import { View } from 'react-native';

import ScalableText from '../../scalableText/ScalableText';
import CoverImage from '../../coverImage/CoverImage';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import PhotoCountBadge from '../../photoCount/PhotoCount';
import FacebookReactions from '../../facebookReactions/FacebookReactions';
import MediaIndicator from '../../mediaIndicator/MediaIndicator';

import { CameraIcon, MicIcon } from '../../svg';
import { stylesSingle, stylesMulti, stylesMultiScroll } from './styles';

import { getImageSizeForWidth, buildImageUri, buildArticleImageUri } from '../../../util/ImageUtil';

const getArticleStyle = type => {
  switch (type) {
    case 'single': {
      return stylesSingle;
    }
    case 'scroll': {
      return stylesMultiScroll;
    }
    default: {
      return stylesMulti;
    }
  }
};

const Article = props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const style = getArticleStyle(props.type);

  const subtitle = props.data.subtitle ? (
    <ScalableText style={style.subtitle}>{props.data.subtitle}</ScalableText>
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
            style={style.imageContainer}
            onLayout={event => {
              const { width, height } = event.nativeEvent.layout;
              setDimensions({ width: width, height: height });
            }}
          >
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
            <ScalableText style={style.categoryTitle}>{props.data.category_title}</ScalableText>
          </View>
          <ScalableText style={style.title}>{props.data.title}</ScalableText>
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

export default React.memo(Article);
