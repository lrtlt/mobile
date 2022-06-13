import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import CoverImage from '../coverImage/CoverImage';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {buildArticleImageUri, getImageSizeForWidth} from '../../util/ImageUtil';
import {ArticlePhotoType} from '../../api/Types';
import {checkEqual} from '../../util/LodashEqualityCheck';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';

const DEFAULT_ASPECT_RATIO = 1.5;

const getAspectRatio = (w_h: string | number) => {
  if (w_h) {
    const ratio = Number(w_h);
    if (ratio > 1) {
      return DEFAULT_ASPECT_RATIO;
    } else {
      return ratio;
    }
  }
  return DEFAULT_ASPECT_RATIO;
};

const PhotoComponent = (
  photo: ArticlePhotoType,
  width: number,
  pressHandler?: (selectedPhoto: any) => void,
) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        ...styles.imageContainer,
        backgroundColor: colors.photoBackground,
        width,
      }}>
      <TouchableDebounce
        style={styles.flex}
        onPress={useCallback(() => {
          pressHandler && pressHandler({type: 'photo', item: photo});
        }, [photo, pressHandler])}>
        {photo && (
          <CoverImage
            style={{
              ...styles.image,
              width,
              aspectRatio: getAspectRatio(photo.w_h),
            }}
            source={{uri: buildArticleImageUri(getImageSizeForWidth(width), photo.path)}}
          />
        )}
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
        {PhotoComponent(photo, width)}

        <View style={styles.imageCountOverlay}>
          <TextComponent style={styles.imageCountOverlayText} fontFamily="SourceSansPro-SemiBold">
            +{count}
          </TextComponent>
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
  if (!data?.length) {
    return null;
  }

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
      {data[6]
        ? PhotoWithOverlayComponent(data[5], expectedWidth, itemSelectHandler, data.length - 6)
        : data[5]
        ? PhotoComponent(data[5], expectedWidth, itemSelectHandler)
        : null}
    </View>
  );
};

export default React.memo(ArticleGallery, checkEqual);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 12,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
    aspectRatio: DEFAULT_ASPECT_RATIO,
    backgroundColor: '#bbbbbb80',
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
    alignSelf: 'center',
  },
});
