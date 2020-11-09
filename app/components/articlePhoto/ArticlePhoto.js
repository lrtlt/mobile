/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image as DefaultRNImage} from 'react-native';
import Image from '../coverImage/CoverImage';
import ProgressiveImage from '../progressiveImage/ProgressiveImage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../scalableText/ScalableText';
import Styles from './styles';
import {IMG_SIZE_XS, buildArticleImageUri, getImageSizeForWidth} from '../../util/ImageUtil';
import EStyleSheet from 'react-native-extended-stylesheet';

const getHorizontalImageComponent = (props, imgSize, aspectRatio, photo) => {
  if (props.progressive === true) {
    return (
      <ProgressiveImage
        style={{...Styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
        thumbnailSource={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
        resizeMode={'cover'}
      />
    );
  } else {
    return (
      <Image
        style={{...Styles.image, aspectRatio}}
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
        style={{...Styles.imageVertical, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
        thumbnailSource={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
        resizeMode={'cover'}
      />
    );
  } else {
    image = (
      <Image
        style={{...Styles.imageVertical, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }

  return (
    <View style={Styles.verticalImageContainer}>
      <DefaultRNImage
        resizeMode="stretch"
        style={Styles.verticalImageBackground}
        blurRadius={3}
        source={{uri: buildArticleImageUri(IMG_SIZE_XS, photo.path)}}
      />
      {image}
    </View>
  );
};

const render = (props) => {
  const {photo} = props;

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
      <Text style={Styles.bottomText}>
        {photo.title} / {photo.author}
      </Text>
    </View>
  );
};

const renderError = (props) => {
  return (
    <View {...props}>
      <View style={Styles.errorContainer}>
        <Icon name={'broken-image'} size={40} color={EStyleSheet.value('$buttonContentColor')} />
      </View>
    </View>
  );
};

const articlePhoto = (props) => {
  if (props.photo) {
    return render(props);
  } else {
    return renderError(props);
  }
};

export default React.memo(articlePhoto);
