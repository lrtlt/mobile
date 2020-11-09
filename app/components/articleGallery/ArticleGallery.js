import React from 'react';
import {View, Text} from 'react-native';
import Styles from './styles';
import Image from '../coverImage/CoverImage';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {buildArticleImageUri, getImageSizeForWidth} from '../../util/ImageUtil';

const renderPhoto = (photo, width, pressHandler) => {
  let img;
  if (photo) {
    const imgSize = getImageSizeForWidth(width);
    const aspectRatio = 3 / 2;
    img = (
      <Image
        style={{...Styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }

  return (
    <View style={Styles.imageContainer}>
      <TouchableDebounce onPress={() => pressHandler({type: 'photo', item: photo})}>
        <View>{img}</View>
      </TouchableDebounce>
    </View>
  );
};

const renderPhotoWithOverlay = (photo, width, pressHandler, count) => {
  return (
    <TouchableDebounce onPress={() => pressHandler({type: 'photo', item: photo})}>
      <View style={Styles.imageContainer}>
        {renderPhoto(photo, width, null)}

        <View style={Styles.imageCountOverlay}>
          <Text style={Styles.imageCountOverlayText}>+{count}</Text>
        </View>
      </View>
    </TouchableDebounce>
  );
};

const gallery = (props) => {
  const {data} = props;

  if (data.length === 0) {
    return <View />;
  }

  const lastPhoto = data[5]
    ? renderPhotoWithOverlay(data[5], props.expectedWidth, props.itemSelectHandler, data.length)
    : null;

  return (
    <View style={Styles.container}>
      {renderPhoto(data[0], props.expectedWidth, props.itemSelectHandler)}
      <View style={Styles.row}>
        {renderPhoto(data[1], props.expectedWidth / 2, props.itemSelectHandler)}
        <View style={Styles.space} />
        {renderPhoto(data[2], props.expectedWidth / 2, props.itemSelectHandler)}
      </View>
      <View style={Styles.row}>
        {renderPhoto(data[3], props.expectedWidth / 2, props.itemSelectHandler)}
        <View style={Styles.space} />
        {renderPhoto(data[4], props.expectedWidth / 2, props.itemSelectHandler)}
      </View>
      <View style={Styles.space} />
      {lastPhoto}
    </View>
  );
};

export default gallery;
