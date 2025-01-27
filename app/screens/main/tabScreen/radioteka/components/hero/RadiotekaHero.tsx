import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, ScrollView} from 'react-native';
import Animated, {useAnimatedStyle, withSpring, useSharedValue} from 'react-native-reanimated';
import {Text, TouchableDebounce} from '../../../../../../components';
import ThemeProvider from '../../../../../../theme/ThemeProvider';
import {themeLight} from '../../../../../../Theme';
import {IconPlay} from '../../../../../../components/svg';
import {RadiotekaTopArticlesBlock} from '../../../../../../api/Types';
import FastImage from 'react-native-fast-image';
import {buildImageUri, IMG_SIZE_M, IMG_SIZE_XXL} from '../../../../../../util/ImageUtil';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');
const width = Math.min(Dimensions.get('window').width * 0.32, 150);

interface Props {
  block: RadiotekaTopArticlesBlock;
}

const RadiotekaHero: React.FC<React.PropsWithChildren<Props>> = ({block}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {data} = block;
  const articles = data.articles_list;

  const scaleValues = articles?.map(() => useSharedValue(1));

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

  const handleItemPress = (index: number) => {
    setSelectedIndex(index);
  };

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
              <TouchableDebounce style={styles.playButton}>
                <IconPlay size={14} />
                {/* <Text style={styles.playButtonText}>Klausytis</Text> */}
              </TouchableDebounce>

              <TouchableDebounce style={styles.moreButton}>
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
              <TouchableOpacity key={item.id} onPress={() => handleItemPress(index)}>
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
              </TouchableOpacity>
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
    paddingTop: 80,
    paddingBottom: 40,
    marginBottom: 64,
  },
  header: {
    paddingHorizontal: 12,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 19,
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
  playButton: {
    backgroundColor: '#FFD600',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    aspectRatio: 1,
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
