import React, {useCallback} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {getImageSizeForWidth, buildArticleImageUri, buildImageUri, IMG_SIZE_XS} from '../../util/ImageUtil';
import Image from '../progressiveImage/ProgressiveImage';
import MediaIndicator from '../mediaIndicator/MediaIndicator';
import {VIDEO_ASPECT_RATIO, VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import {ArticlePhotoType} from '../../api/Types';

/** Comes from embeded element within the articles paragraphs */
type AlternativeVideoCoverType = {
  img_path_postfix?: string;
  img_path_prefix?: string;
};

export type VideoCoverType = (ArticlePhotoType | AlternativeVideoCoverType) & {aspectRatio?: number};

const VideoCover: React.FC<VideoCoverType> = (props) => {
  const renderImage = useCallback((uri?: string, thumbUri?: string) => {
    return (
      <View style={{...styles.videoImageContainer, aspectRatio: props.aspectRatio ?? VIDEO_ASPECT_RATIO}}>
        <Image
          style={{...styles.photo, aspectRatio: props.aspectRatio ?? VIDEO_ASPECT_RATIO}}
          source={{uri}}
          thumbnailSource={{uri: thumbUri}}
        />
        <MediaIndicator style={styles.mediaIndicator} size="small" />
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
      } else {
        return renderImage(VIDEO_DEFAULT_BACKGROUND_IMAGE, undefined);
      }
    }
  }

  return null;
};

const isArticlePhoto = (cover?: ArticlePhotoType | AlternativeVideoCoverType): cover is ArticlePhotoType => {
  return Boolean((cover as ArticlePhotoType)?.path);
};

export default React.memo(VideoCover);

const styles = StyleSheet.create({
  photo: {
    width: '100%',
  },
  videoImageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mediaIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
