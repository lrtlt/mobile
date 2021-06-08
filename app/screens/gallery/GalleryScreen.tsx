import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import GallerySwiper from 'react-native-gallery-swiper';
import {buildArticleImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import {BorderlessButton} from 'react-native-gesture-handler';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconClose} from '../../components/svg';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import formatImages from './formatImages';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Gallery'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Gallery'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const GalleryScreen: React.FC<Props> = ({route, navigation}) => {
  const [state] = useState(() => {
    const selectedImage = route.params.selectedImage ?? null;
    const images = route.params.images ?? [];

    let initialIndex = 0;
    if (selectedImage) {
      initialIndex = images.findIndex((img) => img.path === selectedImage.path);
      initialIndex = Math.max(0, initialIndex);
    }

    const formattedImages = formatImages(images, initialIndex);
    return {
      initialIndex,
      images: formattedImages,
      imageUrls: formattedImages.map((img) => ({
        uri: buildArticleImageUri(IMG_SIZE_XXL, img.path),
      })),
    };
  });

  const [selectedIndex, setSelectedIndex] = useState(state.initialIndex);

  const goBackHandler = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {images, imageUrls} = state;
  const {colors, dim} = useTheme();

  const image = images[selectedIndex];

  return (
    <View style={styles.container}>
      <GallerySwiper
        style={{backgroundColor: colors.background}}
        images={imageUrls}
        sensitiveScroll={false}
        initialNumToRender={2}
        //initialPage={state.initialIndex}
        pageMargin={4}
        onPageSelected={setSelectedIndex}
      />
      <View style={{...styles.detailsContainer, backgroundColor: colors.background}}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.row}>
            <Text style={styles.authorText} type="secondary">
              {image.author}
            </Text>
            <Text style={styles.authorText} type="secondary">
              {`${selectedIndex + 1} / ${images.length}`}
            </Text>
          </View>
          <Text style={styles.title}>{image.title}</Text>
        </SafeAreaView>
      </View>
      <View style={styles.absoluteLayout}>
        <SafeAreaView edges={['top', 'left']}>
          <View style={styles.backButtonContainer}>
            <BorderlessButton onPress={goBackHandler} hitSlop={{left: 12, right: 12, top: 12, bottom: 12}}>
              <IconClose color={colors.headerTint} size={dim.appBarIconSize} />
            </BorderlessButton>
          </View>
        </SafeAreaView>
      </View>
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
