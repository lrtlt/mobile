import React from 'react';
import {View, Image as ReactNativeImage, StyleSheet, Dimensions, ViewStyle} from 'react-native';
import CoverImage from '../coverImage/CoverImage';
import ProgressiveImage from '../progressiveImage/ProgressiveImage';
import {IMG_SIZE_XS, buildArticleImageUri, getImageSizeForWidth, ImageSize} from '../../util/ImageUtil';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import {Icon404} from '../svg';
import {ArticlePhotoType} from '../../api/Types';

interface ImageWrapperProps {
  progressive?: boolean;
  photo: ArticlePhotoType;
  aspectRatio: number;
  imgSize: ImageSize;
}

const HorizontalImageComponent: React.FC<ImageWrapperProps> = ({
  progressive,
  photo,
  aspectRatio,
  imgSize,
}) => {
  if (progressive) {
    return (
      <ProgressiveImage
        style={{...styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
        thumbnailSource={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
      />
    );
  } else {
    return (
      <CoverImage
        style={{...styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }
};

const VerticalImageComponent: React.FC<ImageWrapperProps> = ({progressive, photo, aspectRatio, imgSize}) => {
  let image;
  if (progressive === true) {
    image = (
      <ProgressiveImage
        style={{...styles.imageVertical, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
        thumbnailSource={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
      />
    );
  } else {
    image = (
      <CoverImage
        style={{...styles.imageVertical, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }

  return (
    <View style={styles.verticalImageContainer}>
      <ReactNativeImage
        resizeMode="stretch"
        style={styles.verticalImageBackground}
        blurRadius={3}
        source={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
      />
      {image}
    </View>
  );
};

interface Props {
  style?: ViewStyle;
  expectedWidth: number;
  photo?: ArticlePhotoType;
  imageAspectRatio?: number;
  progressive?: boolean;
}

const ArticlePhoto: React.FC<Props> = ({photo, style, expectedWidth, imageAspectRatio, ...props}) => {
  const {colors} = useTheme();

  if (!photo) {
    return (
      <View style={style}>
        <View style={styles.errorContainer}>
          <Icon404 size={60} color={colors.buttonContent} />
        </View>
      </View>
    );
  }

  const aspectRatio = imageAspectRatio ?? parseFloat(photo.w_h);

  let image: React.ReactNode;
  if (aspectRatio < 1) {
    image = VerticalImageComponent({
      photo,
      aspectRatio,
      imgSize: getImageSizeForWidth(expectedWidth / aspectRatio),
      progressive: props.progressive,
    });
  } else {
    image = HorizontalImageComponent({
      photo,
      aspectRatio,
      imgSize: getImageSizeForWidth(expectedWidth),
      progressive: props.progressive,
    });
  }

  return (
    <View style={style}>
      {image}
      <TextComponent style={styles.bottomText} type="secondary">
        {photo.title} / {photo.author}
      </TextComponent>
    </View>
  );
};

export default React.memo(ArticlePhoto, (prevProps, nextProps) => {
  return (
    prevProps.expectedWidth === nextProps.expectedWidth && prevProps.photo?.path === nextProps.photo?.path
  );
});

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
  imageVertical: {
    width: '100%',
    maxHeight: Dimensions.get('screen').height * 0.6,
  },
  verticalImageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  verticalImageBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorContainer: {
    flex: 1,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    fontSize: 13,
    marginTop: 4,
  },
});
