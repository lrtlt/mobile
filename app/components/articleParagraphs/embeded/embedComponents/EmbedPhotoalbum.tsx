import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {Text, TouchableDebounce} from '../../..';
import {ArticleEmbedPhotoalbumType, ArticlePhotoType} from '../../../../api/Types';
import {MainStackParamList} from '../../../../navigation/MainStack';
import {useTheme} from '../../../../Theme';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../../util/ImageUtil';
import {IconPhotoCamera} from '../../../svg';

interface Props {
  data: ArticleEmbedPhotoalbumType;
}

const EmbedPhotoalbum: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Article'>>();

  const visibleImagesCount = Math.round(Math.max(dimensions.width / 180, 2));
  const images = data.el.album_photos;

  const {colors} = useTheme();
  const imageWidth = dimensions.width / visibleImagesCount - 6;
  const visibleImages = images.slice(0, visibleImagesCount);

  let aspectRatio = 0;
  visibleImages.forEach((i) => {
    aspectRatio = Math.max(Number(i.w_h), aspectRatio);
  });

  const openGalleryHandler = useCallback(
    (image: ArticlePhotoType) => {
      navigation.navigate('Gallery', {
        images: images,
        selectedImage: image,
      });
    },
    [images, navigation],
  );

  return (
    <View style={{...styles.container, backgroundColor: colors.background}}>
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          <IconPhotoCamera size={20} color={colors.buttonContent} />
        </View>
        <Text style={styles.title} fontFamily="SourceSansPro-SemiBold">
          {data.el.title}
        </Text>
      </View>
      <View
        style={styles.imageRowContainer}
        onLayout={(event) => {
          setDimensions(event.nativeEvent.layout);
        }}>
        {visibleImages.map((image, index) => {
          if (!image) {
            console.warn('No image data to render EmbedPhotoalbum');
            return null;
          }

          const imgUri = buildArticleImageUri(IMG_SIZE_M, image.path);
          return (
            <TouchableDebounce
              key={image.path}
              onPress={() => {
                openGalleryHandler(image);
              }}>
              <View
                style={{
                  ...styles.imageHolder,
                  width: imageWidth,
                  backgroundColor: colors.lightGreyBackground,
                }}>
                <FastImage
                  style={{
                    width: imageWidth,
                    aspectRatio: aspectRatio,
                  }}
                  source={{uri: imgUri}}
                  resizeMode={FastImage.resizeMode.contain}
                />

                {index === visibleImagesCount - 1 && (
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText} fontFamily="SourceSansPro-Regular">
                      +{data.el.album_photos.length - 2}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableDebounce>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(EmbedPhotoalbum, (prev, next) => prev.data.el.id === next.data.el.id);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 19,
    flex: 1,
  },

  imageRowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  imageHolder: {
    height: '100%',
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(34, 44, 53, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 22,
  },
});
