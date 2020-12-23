import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import GallerySwiper from 'react-native-gallery-swiper';
import {buildArticleImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import {BorderlessButton} from 'react-native-gesture-handler';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconClose} from '../../components/svg';

/**
 * Formats images array so that the element at given index starts at the beggening. Trailing images appended to the end of the array.
 * This is a workaround for issue in gallery swiper https://github.com/Luehang/react-native-gallery-swiper/issues/26
 */
const formatImages = (imagesArray, index) => {
  if (!index || index === 0 || imagesArray.length <= 1) {
    return imagesArray;
  }

  const start = imagesArray.slice(index, imagesArray.length);
  const end = imagesArray.slice(0, index);
  return start.concat(end);
};

const GalleryScreen = (props) => {
  const {route, navigation} = props;

  const {colors, dim} = useTheme();

  const [state, setState] = useState(() => {
    const selectedImage = route.params.selectedImage ?? null;
    const images = route.params.images ?? [];

    let initialIndex = 0;
    if (selectedImage) {
      initialIndex = images.findIndex((img) => img.path === selectedImage.path);
      initialIndex = Math.max(0, initialIndex);
    }
    return {
      index: initialIndex,
      initialIndex,
      images: formatImages(images, initialIndex),
    };
  });

  const renderDetails = () => {
    const image = state.images[state.index];
    return (
      <View style={{...styles.detailsContainer, backgroundColor: colors.background}}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.row}>
            <Text style={styles.authorText} type="secondary">
              {image.author}
            </Text>
            <Text style={styles.authorText} type="secondary">
              {state.index + 1} / {state.images.length}
            </Text>
          </View>
          <Text style={styles.title}>{image.title}</Text>
        </SafeAreaView>
      </View>
    );
  };

  const renderExitButton = () => {
    return (
      <View style={styles.absoluteLayout}>
        <SafeAreaView edges={['top', 'left']}>
          <View style={styles.backButtonContainer}>
            <BorderlessButton onPress={() => navigation.goBack()}>
              <IconClose color={colors.headerTint} size={dim.appBarIconSize} />
            </BorderlessButton>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  const imageUrls = state.images.map((img) => ({
    uri: buildArticleImageUri(IMG_SIZE_XXL, img.path),
  }));

  return (
    <View style={styles.container}>
      <GallerySwiper
        style={{backgroundColor: colors.background}}
        images={imageUrls}
        sensitiveScroll={false}
        initialNumToRender={2}
        //initialPage={state.initialIndex}
        pageMargin={4}
        onPageSelected={(i) => setState({...state, index: i})}
      />
      {renderDetails()}
      {renderExitButton()}
    </View>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  absoluteLayout: {
    position: 'absolute',
  },
  backButtonContainer: {
    margin: 8,
    padding: 16,
    borderRadius: 40,
    backgroundColor: '#FFFFFF30',
  },
  detailsContainer: {
    padding: 16,
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    opacity: 0.8,
  },
  authorText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
    marginTop: 4,
  },
  title: {
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
  },
});
