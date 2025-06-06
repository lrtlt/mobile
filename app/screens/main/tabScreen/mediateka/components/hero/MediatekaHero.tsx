import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import FastImage from '@d11/react-native-fast-image';

import LinearGradient from 'react-native-linear-gradient';

import {MediatekaBlockWidget} from '../../../../../../api/Types';
import {Article} from '../../../../../../../Types';
import {buildImageUri, IMG_SIZE_M, IMG_SIZE_XXL} from '../../../../../../util/ImageUtil';
import ThemeProvider from '../../../../../../theme/ThemeProvider';
import {themeLight, useTheme} from '../../../../../../Theme';
import {Text, TouchableDebounce} from '../../../../../../components';
import {IconPlay} from '../../../../../../components/svg';

const {height} = Dimensions.get('window');
const width = Math.min(Dimensions.get('window').width * 0.65, 300);

interface Props {
  block: MediatekaBlockWidget;
  onArticlePress: (article: Article) => void;
}

const MediatekaHero: React.FC<React.PropsWithChildren<Props>> = ({block, onArticlePress}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const articles = block['widget-data']?.articles_list ?? [];

  const {colors} = useTheme();

  const scaleValues = articles.map(() => useSharedValue(1));

  // Early return if no articles
  if (!articles || articles.length === 0) {
    return null;
  }

  const selectedArticle = articles[selectedIndex];
  if (!selectedArticle) {
    return null;
  }

  useEffect(() => {
    // Reset all scales to 1
    scaleValues.forEach((scale, index) => {
      scale.value = withTiming(index === selectedIndex ? 1.05 : 1, {duration: 200});
    });
  }, [selectedIndex, scaleValues]);

  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{scale: scaleValues[index]?.value ?? 1}],
        borderWidth: 2,
        borderColor: index === selectedIndex ? '#FFFFFF' : 'transparent',
      };
    });
  };

  const handleItemPress = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const imgUrl = buildImageUri(
    IMG_SIZE_XXL,
    selectedArticle.hero_photo?.img_path_prefix ?? selectedArticle.img_path_prefix,
    selectedArticle.hero_photo?.img_path_postfix ?? selectedArticle.img_path_postfix,
  );

  const durationMinutes = Math.floor((selectedArticle.media_duration_sec ?? 0) / 60);
  return (
    <ThemeProvider forceTheme={themeLight}>
      <View style={styles.container}>
        <FastImage
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
          source={{uri: imgUrl}}
          resizeMode="cover"
        />
        <LinearGradient
          style={StyleSheet.absoluteFillObject}
          colors={['#000000', '#00000033', '#00000000']}
          useAngle={true}
          angle={0}
        />
        <LinearGradient
          style={StyleSheet.absoluteFillObject}
          colors={['#00000066', '#00000000']}
          useAngle={true}
          angle={90}
        />
        <View style={styles.header}>
          <Text style={styles.headerText} fontFamily="SourceSansPro-SemiBold" numberOfLines={1}>
            Mediateka rekomenduoja
          </Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.mainContentText}>
            <Text style={styles.duration} fontFamily="SourceSansPro-SemiBold">
              {durationMinutes}min.
            </Text>
            <Text style={styles.title} fontFamily="PlayfairDisplay-Regular">
              {selectedArticle.title}
            </Text>
            <Text style={styles.subtitle}>{selectedArticle.category_title} </Text>
            <View style={styles.buttonContainer}>
              <TouchableDebounce
                style={{...styles.moreButton, backgroundColor: colors.mediatekaPlayButton}}
                onPress={() => {
                  onArticlePress?.(selectedArticle);
                }}>
                <IconPlay size={12} color={'white'} />
                <Text style={styles.moreButtonText}>Žiurėti</Text>
              </TouchableDebounce>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bottomScrollView}
            contentContainerStyle={styles.bottomList}>
            {articles.map((item, index) => (
              <TouchableDebounce key={item.id} onPress={() => handleItemPress(index)}>
                <Animated.View style={[styles.thumbnailContainer, getAnimatedStyle(index)]}>
                  <FastImage
                    source={{
                      uri: buildImageUri(
                        IMG_SIZE_M,
                        item.img_path_prefix ?? item.category_img_path_prefix,
                        item.img_path_postfix ?? item.category_img_path_postfix,
                      ),
                    }}
                    style={styles.thumbnail}
                  />
                </Animated.View>
              </TouchableDebounce>
            ))}
          </ScrollView>
        </View>
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height - 100,
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingBottom: 40,
    marginBottom: 64,
  },
  header: {
    paddingHorizontal: 12,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 19,
    textShadowColor: '#00000088',
    textShadowRadius: 8,
    textShadowOffset: {width: 2, height: 1},
    textTransform: 'uppercase',
  },
  mainContent: {
    justifyContent: 'center',
  },
  mainContentText: {
    paddingHorizontal: 12,
  },
  duration: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.8,
    alignSelf: 'flex-start',
    borderRadius: 3,
    backgroundColor: '#000000C0',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    marginVertical: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 17,
    marginBottom: 16,
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  moreButton: {
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  moreButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
  },
  bottomScrollView: {},
  bottomList: {
    flexDirection: 'row',
    paddingVertical: 32,
    paddingHorizontal: 18,
    gap: 12,
  },
  thumbnailContainer: {
    width: width,
    aspectRatio: 1.8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    flex: 1,
    borderRadius: 8,
  },
});

export default MediatekaHero;
