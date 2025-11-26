import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import CoverImage from '../coverImage/CoverImage';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {buildArticleImageUri, IMG_SIZE_M} from '../../util/ImageUtil';
import {ArticlePhotoType} from '../../api/Types';
import {checkEqual} from '../../util/LodashEqualityCheck';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import {Stack, Tiles} from '@grapp/stacks';

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

interface PhotoComponentProps {
  photo: ArticlePhotoType;
  pressHandler?: (selectedPhoto: any) => void;
}

const PhotoComponent: React.FC<PhotoComponentProps> = ({photo, pressHandler}) => {
  const {colors} = useTheme();
  const onPress = useCallback(() => {
    pressHandler && pressHandler({type: 'photo', item: photo});
  }, [photo, pressHandler]);

  return (
    <View
      style={{
        ...styles.imageContainer,
        backgroundColor: colors.photoBackground,
        flex: 1,
      }}>
      <TouchableDebounce style={styles.flex} onPress={onPress}>
        {photo && (
          <CoverImage
            style={{
              ...styles.image,
              aspectRatio: getAspectRatio(photo.w_h),
            }}
            source={{uri: buildArticleImageUri(IMG_SIZE_M, photo.path)}}
          />
        )}
      </TouchableDebounce>
    </View>
  );
};

interface PhotoWithOverlayComponentProps {
  photo: ArticlePhotoType;
  pressHandler: (selectedPhoto: any) => void;
  count: number;
}

const PhotoWithOverlayComponent: React.FC<PhotoWithOverlayComponentProps> = ({
  photo,
  pressHandler,
  count,
}) => {
  const onPressHandler = useCallback(() => {
    pressHandler && pressHandler({type: 'photo', item: photo});
  }, [photo, pressHandler]);

  return (
    <TouchableDebounce onPress={onPressHandler}>
      <View style={styles.imageContainer}>
        <PhotoComponent photo={photo} />

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
  itemSelectHandler: (photo: {type: 'photo'; item: ArticlePhotoType}) => void;
}
const ArticleGallery: React.FC<React.PropsWithChildren<Props>> = ({data, itemSelectHandler}) => {
  if (!data?.length) {
    return null;
  }

  return (
    <Stack space={4} paddingTop={8} paddingBottom={4}>
      {data.length > 0 && <PhotoComponent photo={data[0]} pressHandler={itemSelectHandler} />}
      <Tiles space={4} columns={2} flex={'fluid'}>
        {data.length > 1 && <PhotoComponent photo={data[1]} pressHandler={itemSelectHandler} />}
        {data.length > 2 && <PhotoComponent photo={data[2]} pressHandler={itemSelectHandler} />}
      </Tiles>
      <Tiles space={4} columns={2} flex={'fluid'}>
        {data.length > 3 && <PhotoComponent photo={data[3]} pressHandler={itemSelectHandler} />}
        {data.length > 4 && <PhotoComponent photo={data[4]} pressHandler={itemSelectHandler} />}
      </Tiles>
      {data[6] ? (
        <PhotoWithOverlayComponent photo={data[5]} pressHandler={itemSelectHandler} count={data.length - 6} />
      ) : data[5] ? (
        <PhotoComponent photo={data[5]} pressHandler={itemSelectHandler} />
      ) : null}
    </Stack>
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
