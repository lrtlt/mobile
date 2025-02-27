import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import Animated, {useAnimatedStyle, withSpring, useSharedValue} from 'react-native-reanimated';
import {Text, TouchableDebounce} from '../../../../../../components';
import ThemeProvider from '../../../../../../theme/ThemeProvider';
import {themeLight} from '../../../../../../Theme';
import {RadiotekaTopArticlesBlock} from '../../../../../../api/Types';
import FastImage from 'react-native-fast-image';
import {buildImageUri, IMG_SIZE_M, IMG_SIZE_XXL} from '../../../../../../util/ImageUtil';
import LinearGradient from 'react-native-linear-gradient';
import {Article} from '../../../../../../../Types';
import PlayButton from '../play_button/play_button';
import {useMediaPlayer} from '../../../../../../components/videoComponent/context/useMediaPlayer';
import ArticlePlaylist from '../../../../../../components/videoComponent/context/playlist/ArticlePlaylist';

const {height} = Dimensions.get('window');
const width = Math.min(Dimensions.get('window').width * 0.32, 150);

interface Props {
  block: RadiotekaTopArticlesBlock;
  onArticlePress: (article: Article) => void;
}

const RadiotekaHero: React.FC<React.PropsWithChildren<Props>> = ({block, onArticlePress}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {data} = block;
  const articles = data.articles_list;

  const scaleValues = articles.map(() => useSharedValue(1));
  const {setPlaylist} = useMediaPlayer();

  const playItem = useCallback(
    (index: number) => {
      setPlaylist(
        new ArticlePlaylist(
          articles.map((item) => item.id),
          index,
        ),
      );
    },
    [articles],
  );

  useEffect(() => {
    // Reset all scales to 1
    scaleValues.forEach((scale, index) => {
      scale.value = withSpring(index === selectedIndex ? 1.1 : 1);
    });
  }, [selectedIndex]);

  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{scale: scaleValues[index].value}],
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
    articles[selectedIndex].hero_photo?.img_path_prefix ?? articles[selectedIndex].img_path_prefix,
    articles[selectedIndex].hero_photo?.img_path_postfix ?? articles[selectedIndex].img_path_postfix,
  );

  const durationMinutes = Math.floor((articles[selectedIndex].media_duration_sec ?? 0) / 60);
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
            Radioteka rekomenduoja
          </Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.mainContentText}>
            <Text style={styles.duration}>{durationMinutes}min.</Text>
            <Text style={styles.title} fontFamily="PlayfairDisplay-Regular">
              {articles[selectedIndex].category_title}
            </Text>
            <Text style={styles.subtitle}>{articles[selectedIndex].title}</Text>
            <View style={styles.buttonContainer}>
              <PlayButton onPress={() => playItem(selectedIndex)} />
              <TouchableDebounce
                style={styles.moreButton}
                onPress={() => {
                  onArticlePress?.(articles[selectedIndex]);
                }}>
                <Text style={styles.moreButtonText}>Daugiau</Text>
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
                        item.category_img_path_prefix,
                        item.category_img_path_postfix,
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
    backgroundColor: '#000000A0',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    marginVertical: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 17,
    marginBottom: 30,
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  moreButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  moreButtonText: {
    color: '#000000',
    fontSize: 15,
  },
  bottomScrollView: {},
  bottomList: {
    flexDirection: 'row',
    paddingVertical: 32,
    paddingHorizontal: 18,
    gap: 16,
  },
  thumbnailContainer: {
    width: width,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default RadiotekaHero;
