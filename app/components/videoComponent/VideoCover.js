import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {getImageSizeForWidth, buildArticleImageUri, buildImageUri, IMG_SIZE_XS} from '../../util/ImageUtil';
import Image from '../progressiveImage/ProgressiveImage';
import MediaIndicator from '../mediaIndicator/MediaIndicator';
import PropTypes from 'prop-types';
import {VIDEO_ASPECT_RATIO} from '../../constants';

const VideoCover = ({cover, coverComponent}) => {
  if (coverComponent) {
    return coverComponent;
  }

  const renderImage = (uri, thumbUri) => {
    return (
      <View style={styles.videoImageContainer}>
        <Image style={styles.photo} resizeMode="contain" source={{uri}} thumbnailSource={{uri: thumbUri}} />
        <MediaIndicator style={styles.mediaIndicator} />
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

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
  },
  videoImageContainer: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mediaIndicator: {
    width: 44,
    height: 44,
    position: 'absolute',
    alignSelf: 'center',
    paddingStart: 4,
    borderRadius: 22,
  },
});
