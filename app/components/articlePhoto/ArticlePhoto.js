import React from 'react';
import {View, Image as DefaultRNImage, StyleSheet, Dimensions} from 'react-native';
import Image from '../coverImage/CoverImage';
import ProgressiveImage from '../progressiveImage/ProgressiveImage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {IMG_SIZE_XS, buildArticleImageUri, getImageSizeForWidth} from '../../util/ImageUtil';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';

const getHorizontalImageComponent = (props, imgSize, aspectRatio, photo) => {
  if (props.progressive === true) {
    return (
      <ProgressiveImage
        style={{...styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
        thumbnailSource={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
        resizeMode={'cover'}
      />
    );
  } else {
    return (
      <Image
        style={{...styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }
};

const getVerticalImageComponent = (props, imgSize, aspectRatio, photo) => {
  let image;
  if (props.progressive === true) {
    image = (
      <ProgressiveImage
        style={{...styles.imageVertical, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
        thumbnailSource={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
        resizeMode={'cover'}
      />
    );
  } else {
    image = (
      <Image
        style={{...styles.imageVertical, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }

  return (
    <View style={styles.verticalImageContainer}>
      <DefaultRNImage
        resizeMode="stretch"
        style={styles.verticalImageBackground}
        blurRadius={3}
        source={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
      />
      {image}
    </View>
  );
};

const ArticlePhoto = (props) => {
  const {colors} = useTheme();
  const {photo} = props;

  const renderError = () => {
    return (
      <View {...props}>
        <View style={styles.errorContainer}>
          <Icon name={'broken-image'} size={40} color={colors.buttonContent} />
        </View>
      </View>
    );
  };

  if (!photo) {
    return renderError();
  }

  let aspectRatio;
  if (props.imageAspectRatio) {
    aspectRatio = props.imageAspectRatio;
  } else {
    aspectRatio = parseFloat(photo.w_h);
  }

  let image;
  if (aspectRatio < 1) {
    const imgSize = getImageSizeForWidth(props.expectedWidth / aspectRatio);
    image = getVerticalImageComponent(props, imgSize, aspectRatio, photo);
  } else {
    const imgSize = getImageSizeForWidth(props.expectedWidth);
    image = getHorizontalImageComponent(props, imgSize, aspectRatio, photo);
  }

  return (
    <View {...props}>
      {image}
      <TextComponent style={styles.bottomText} type="secondary">
        {photo.title} / {photo.author}
      </TextComponent>
    </View>
  );
};

export default ArticlePhoto;

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
  imageVertical: {
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.6,
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
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
    marginTop: 4,
  },
});
