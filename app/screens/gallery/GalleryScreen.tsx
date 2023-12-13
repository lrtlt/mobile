import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import {buildArticleImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import {BorderlessButton} from 'react-native-gesture-handler';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconClose} from '../../components/svg';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';

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

    return {
      initialIndex,
      images: images,
      imageUrls: images.map((img) => buildArticleImageUri(IMG_SIZE_XXL, img.path)),
    };
  });

  const [selectedIndex, setSelectedIndex] = useState(state.initialIndex);

  useNavigationAnalytics({
    type: 'Gallery',
    title: 'Galerija',
  });

  const goBackHandler = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {images, imageUrls} = state;
  const {colors, dark} = useTheme();

  const image = images[selectedIndex];

  return (
    <View style={styles.container}>
      <Gallery
        style={{backgroundColor: colors.background}}
        data={imageUrls}
        keyExtractor={(item, i) => item ?? i.toString()}
        numToRender={3}
        initialIndex={state.initialIndex}
        onIndexChange={setSelectedIndex}
        loop={true}
        emptySpaceWidth={8}
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
          <Text style={styles.title} fontFamily="PlayfairDisplay-Regular">
            {image.title}
          </Text>
        </SafeAreaView>
      </View>
      <View style={styles.absoluteLayout}>
        <SafeAreaView edges={['top', 'left']}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.backButtonContainer,
              backgroundColor: dark ? '#343434cc' : '#eaeaeacc',
            }}>
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
    borderRadius: 12,
    backgroundColor: '#545454cc',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 13,
    marginTop: 4,
  },
  title: {
    marginTop: 4,
    fontSize: 16,
  },
});
