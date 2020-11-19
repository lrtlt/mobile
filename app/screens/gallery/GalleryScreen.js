import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from './styles';

import Gemius from 'react-native-gemius-plugin';
import GallerySwiper from 'react-native-gallery-swiper';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {buildArticleImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import {BorderlessButton} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';

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

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'gallery'});
  }, []);

  const renderDetails = () => {
    const image = state.images[state.index];
    return (
      <View style={Styles.detailsContainer}>
        <View style={Styles.row}>
          <Text style={Styles.authorText}>{image.author}</Text>
          <Text style={Styles.authorText}>
            {state.index + 1} / {state.images.length}
          </Text>
        </View>
        <Text style={Styles.title}>{image.title}</Text>
      </View>
    );
  };

  const renderExitButton = () => {
    return (
      <View style={Styles.absoluteLayout}>
        <View style={Styles.backButtonContainer}>
          <BorderlessButton onPress={() => navigation.goBack()}>
            <Icon name="close" color={EStyleSheet.value('$headerTintColor')} size={32} />
          </BorderlessButton>
        </View>
      </View>
    );
  };

  const imageUrls = state.images.map((img) => ({
    uri: buildArticleImageUri(IMG_SIZE_XXL, img.path),
  }));

  return (
    <View style={Styles.container}>
      <GallerySwiper
        style={Styles.gallerySwiper}
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
