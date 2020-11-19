import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
        style={{...styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }

  return (
    <View style={styles.imageContainer}>
      <TouchableDebounce onPress={() => pressHandler({type: 'photo', item: photo})}>
        <View>{img}</View>
      </TouchableDebounce>
    </View>
  );
};

const renderPhotoWithOverlay = (photo, width, pressHandler, count) => {
  return (
    <TouchableDebounce onPress={() => pressHandler({type: 'photo', item: photo})}>
      <View style={styles.imageContainer}>
        {renderPhoto(photo, width, null)}

        <View style={styles.imageCountOverlay}>
          <Text style={styles.imageCountOverlayText}>+{count}</Text>
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
    <View style={styles.container}>
      {renderPhoto(data[0], props.expectedWidth, props.itemSelectHandler)}
      <View style={styles.row}>
        {renderPhoto(data[1], props.expectedWidth / 2, props.itemSelectHandler)}
        <View style={styles.space} />
        {renderPhoto(data[2], props.expectedWidth / 2, props.itemSelectHandler)}
      </View>
      <View style={styles.row}>
        {renderPhoto(data[3], props.expectedWidth / 2, props.itemSelectHandler)}
        <View style={styles.space} />
        {renderPhoto(data[4], props.expectedWidth / 2, props.itemSelectHandler)}
      </View>
      <View style={styles.space} />
      {lastPhoto}
    </View>
  );
};

export default gallery;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 24,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  imageCountOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 44, 53, 0.8)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  imageCountOverlayText: {
    color: 'white',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 40,
  },
  space: {
    width: 12,
    height: 12,
  },
  row: {
    paddingTop: 12,
    width: '100%',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
  },
});
