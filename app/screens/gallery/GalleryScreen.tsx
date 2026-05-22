import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, useWindowDimensions, NativeSyntheticEvent} from 'react-native';
import PagerView, {PagerViewOnPageSelectedEventData} from 'react-native-pager-view';
import {buildArticleImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import {BorderlessButton} from 'react-native-gesture-handler';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconClose} from '../../components/svg';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import ZoomableImage from './ZoomableImage';
import ThumbnailStrip from './ThumbnailStrip';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Gallery'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Gallery'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CAPTION_HEIGHT = 88;
const THUMB_STRIP_HEIGHT = 72;

const GalleryScreen: React.FC<React.PropsWithChildren<Props>> = ({route, navigation}) => {
  const [state] = useState(() => {
    const selectedImage = route.params.selectedImage ?? null;
    const images = route.params.images ?? [];

    let initialIndex = 0;
    if (selectedImage) {
      initialIndex = images.findIndex((img) => img.path === selectedImage.path);
      initialIndex = Math.max(0, initialIndex);
    }

    return {
      initialIndex,
      images: images,
      imageUrls: images.map((img) => buildArticleImageUri(IMG_SIZE_XXL, img.path)),
    };
  });

  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  const pagerRef = useRef<PagerView>(null);
  const [selectedIndex, setSelectedIndex] = useState(state.initialIndex);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useNavigationAnalytics(
    useMemo(
      () => ({
        viewId: 'Lrt app - Gallery',
        title: 'Lrt app - Nuotraukų galerija',
      }),
      [],
    ),
  );

  const pagerHeight = Math.max(
    0,
    screenHeight - insets.top - insets.bottom - CAPTION_HEIGHT - THUMB_STRIP_HEIGHT,
  );

  const goBackHandler = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePageSelected = useCallback((e: NativeSyntheticEvent<PagerViewOnPageSelectedEventData>) => {
    setSelectedIndex(e.nativeEvent.position);
  }, []);

  const handleThumbSelect = useCallback((index: number) => {
    pagerRef.current?.setPage(index);
    setSelectedIndex(index);
  }, []);

  const handleZoomChange = useCallback((zoomed: boolean) => {
    setScrollEnabled(!zoomed);
  }, []);

  const {images, imageUrls} = state;
  const image = images[selectedIndex];

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={[styles.pager, {height: pagerHeight, marginTop: insets.top}]}
        initialPage={state.initialIndex}
        onPageSelected={handlePageSelected}
        scrollEnabled={scrollEnabled}
        offscreenPageLimit={1}>
        {imageUrls.map((uri, i) => (
          <View key={uri ?? i.toString()} style={styles.page}>
            {uri && (
              <ZoomableImage
                uri={uri}
                width={screenWidth}
                height={pagerHeight}
                onZoomChange={handleZoomChange}
              />
            )}
          </View>
        ))}
      </PagerView>

      <View style={styles.caption}>
        <Text style={styles.title} fontFamily="SourceSansPro-Regular" numberOfLines={2}>
          {image?.title}
        </Text>
        <View style={styles.row}>
          <Text style={styles.authorText} fontFamily="SourceSansPro-SemiBold">
            {`${selectedIndex + 1} / ${images.length}`}
          </Text>
          {!!image?.author && <Text style={styles.authorText}>{image.author}</Text>}
        </View>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.thumbStripWrapper}>
        <View style={styles.thumbStripInner}>
          <ThumbnailStrip images={images} selectedIndex={selectedIndex} onSelect={handleThumbSelect} />
        </View>
      </SafeAreaView>

      <View style={styles.absoluteLayout}>
        <SafeAreaView edges={['top', 'left']}>
          <View style={styles.backButtonContainer}>
            <BorderlessButton onPress={goBackHandler} hitSlop={{left: 12, right: 12, top: 12, bottom: 12}}>
              <IconClose color={colors.headerTint} size={16} />
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
    backgroundColor: '#000',
  },
  pager: {
    width: '100%',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  absoluteLayout: {
    position: 'absolute',
    top: 0,
    start: 0,
  },
  backButtonContainer: {
    margin: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#eaeaeacc',
  },
  caption: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    height: CAPTION_HEIGHT,
    gap: 4,
  },
  authorText: {
    fontSize: 12.5,
    marginTop: 4,
    color: '#fff',
  },
  title: {
    fontSize: 16.5,
    color: '#fff',
  },
  thumbStripWrapper: {
    backgroundColor: '#000',
  },
  thumbStripInner: {
    height: THUMB_STRIP_HEIGHT,
    justifyContent: 'center',
  },
});
