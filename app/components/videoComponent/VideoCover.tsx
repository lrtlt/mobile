import React, {useCallback} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {getImageSizeForWidth, buildArticleImageUri, buildImageUri, IMG_SIZE_XS} from '../../util/ImageUtil';
import Image from '../progressiveImage/ProgressiveImage';
import MediaIndicator from '../mediaIndicator/MediaIndicator';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {ArticlePhoto} from '../../api/Types';

/** Comes from embeded element within the articles paragraphs */
type AlternativeVideoCoverType = {
  img_path_postfix?: string;
  img_path_prefix?: string;
};

export type VideoCoverType = ArticlePhoto | AlternativeVideoCoverType;

const VideoCover: React.FC<VideoCoverType> = (props) => {
  const renderImage = useCallback((uri?: string, thumbUri?: string) => {
    return (
      <View style={styles.videoImageContainer}>
        <Image style={styles.photo} source={{uri}} thumbnailSource={{uri: thumbUri}} />
        <MediaIndicator style={styles.mediaIndicator} size="big" />
      </View>
    );
  }, []);

  const windowWidth = useWindowDimensions().width;

  if (props) {
    const imgSize = getImageSizeForWidth(windowWidth);
    if (isArticlePhoto(props)) {
      return renderImage(
        buildArticleImageUri(imgSize, props.path),
        buildArticleImageUri(IMG_SIZE_XS, props.path),
      );
    } else {
      if (props.img_path_prefix && props.img_path_postfix) {
        return renderImage(
          buildImageUri(imgSize, props.img_path_prefix, props.img_path_postfix),
          buildImageUri(IMG_SIZE_XS, props.img_path_prefix, props.img_path_postfix),
        );
      }
    }
  }

  return null;
};

const isArticlePhoto = (cover?: ArticlePhoto | AlternativeVideoCoverType): cover is ArticlePhoto => {
  return Boolean((cover as ArticlePhoto)?.path);
};

export default React.memo(VideoCover);

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
    position: 'absolute',
    alignSelf: 'center',
  },
});
