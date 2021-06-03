import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CoverImage from '../coverImage/CoverImage';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {buildArticleImageUri, getImageSizeForWidth} from '../../util/ImageUtil';
import {ArticlePhoto as ArticlePhotoType} from '../../api/Types';

const PhotoComponent = (
  photo: ArticlePhotoType,
  width: number,
  pressHandler?: (selectedPhoto: any) => void,
) => {
  let img;
  if (photo) {
    const imgSize = getImageSizeForWidth(width);
    const aspectRatio = 3 / 2;
    img = (
      <CoverImage
        style={{...styles.image, aspectRatio}}
        source={{uri: buildArticleImageUri(imgSize, photo.path)}}
      />
    );
  }

  const onPressHandler = useCallback(() => {
    pressHandler && pressHandler({type: 'photo', item: photo});
  }, [photo, pressHandler]);

  return (
    <View style={styles.imageContainer}>
      <TouchableDebounce onPress={onPressHandler}>
        <View>{img}</View>
      </TouchableDebounce>
    </View>
  );
};

const PhotoWithOverlayComponent = (
  photo: ArticlePhotoType,
  width: number,
  pressHandler: (selectedPhoto: any) => void,
  count: number,
) => {
  const onPressHandler = useCallback(() => {
    pressHandler && pressHandler({type: 'photo', item: photo});
  }, [photo, pressHandler]);

  return (
    <TouchableDebounce onPress={onPressHandler}>
      <View style={styles.imageContainer}>
        {PhotoComponent(photo, width, undefined)}

        <View style={styles.imageCountOverlay}>
          <Text style={styles.imageCountOverlayText}>+{count}</Text>
        </View>
      </View>
    </TouchableDebounce>
  );
};

interface Props {
  data: ArticlePhotoType[];
  expectedWidth: number;
  itemSelectHandler: (photo: {type: 'photo'; item: ArticlePhotoType}) => void;
}
const ArticleGallery: React.FC<Props> = ({data, expectedWidth, itemSelectHandler}) => {
  if (data.length === 0) {
    return <View />;
  }

  const lastPhoto = data[6]
    ? PhotoWithOverlayComponent(data[5], expectedWidth, itemSelectHandler, data.length - 6)
    : data[5]
    ? PhotoComponent(data[5], expectedWidth, itemSelectHandler)
    : null;

  return (
    <View style={styles.container}>
      {PhotoComponent(data[0], expectedWidth, itemSelectHandler)}
      <View style={styles.row}>
        {PhotoComponent(data[1], expectedWidth / 2, itemSelectHandler)}
        <View style={styles.space} />
        {PhotoComponent(data[2], expectedWidth / 2, itemSelectHandler)}
      </View>
      <View style={styles.row}>
        {PhotoComponent(data[3], expectedWidth / 2, itemSelectHandler)}
        <View style={styles.space} />
        {PhotoComponent(data[4], expectedWidth / 2, itemSelectHandler)}
      </View>
      <View style={styles.space} />
      {lastPhoto}
    </View>
  );
};

export default ArticleGallery;

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
