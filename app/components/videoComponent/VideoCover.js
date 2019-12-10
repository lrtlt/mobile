import React from 'react';
import { View, Dimensions } from 'react-native';
import { getImageSizeForWidth, buildArticleImageUri, buildImageUri, IMG_SIZE_XS } from '../../util/ImageUtil';
import Image from '../progressiveImage/ProgressiveImage';
import MediaIndicator from '../mediaIndicator/MediaIndicator';
import PropTypes from 'prop-types';
import Styles from './styles';

const aspectRatio = 16 / 9;

const VideoCover = ({ cover, coverComponent }) => {
  if (coverComponent) {
    return coverComponent;
  }

  const renderImage = (uri, thumbUri) => {
    return (
      <View style={Styles.videoImageContainer}>
        <Image
          style={{ ...Styles.photo, aspectRatio }}
          resizeMode="contain"
          source={{ uri }}
          thumbnailSource={{ uri: thumbUri }}
        />
        <MediaIndicator style={Styles.mediaIndicator} />
      </View>
    );
  };

  if (cover) {
    const imgSize = getImageSizeForWidth(Dimensions.get('window').width);
    if (cover.path) {
      return renderImage(
        buildArticleImageUri(imgSize, cover.path),
        buildArticleImageUri(IMG_SIZE_XS, cover.path),
      );
    }

    if (cover.img_path_prefix && cover.img_path_postfix) {
      return renderImage(
        buildImageUri(imgSize, cover.img_path_prefix, cover.img_path_postfix),
        buildImageUri(IMG_SIZE_XS, cover.img_path_prefix, cover.img_path_postfix),
      );
    }
  }

  return <View />;
};

VideoCover.propTypes = {
  coverComponent: PropTypes.element,
  cover: PropTypes.object,
};

export default VideoCover;
