import React, {useState, useRef} from 'react';
import {View, StyleSheet, FlatList, Image, ViewToken, useWindowDimensions} from 'react-native';
import Text from '../../../../../../components/text/Text';
import {IconPlay} from '../../../../../../components/svg';
import FastImage from 'react-native-fast-image';
import ListenCount from '../../../../../../components/article/article/ListenCount';
import {TouchableDebounce} from '../../../../../../components';
import {Article} from '../../../../../../../Types';
import {buildImageUri, IMG_SIZE_L, IMG_SIZE_XL} from '../../../../../../util/ImageUtil';
import {getIconForChannelById} from '../../../../../../util/UI';
import LinearGradient from 'react-native-linear-gradient';
import ThemeProvider from '../../../../../../theme/ThemeProvider';
import {themeLight} from '../../../../../../Theme';

interface RadiotekaHeroCarouselProps {
  items: Article[];
  onItemPress?: (index: number) => void;
  onItemPlayPress?: (index: number) => void;
}

export const RadiotekaHeroCarousel: React.FC<RadiotekaHeroCarouselProps> = ({
  items,
  onItemPress,
  onItemPlayPress,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const {width} = useWindowDimensions();

  const onViewableItemsChanged = useRef(({viewableItems}: {viewableItems: ViewToken[]}) => {
    if (viewableItems[0] && typeof viewableItems[0].index === 'number') {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({item, index}: {item: Article; index: number}) => (
    <TouchableDebounce style={[styles.slide, {width}]} onPress={() => onItemPress?.(index)}>
      <View style={styles.cardContainer}>
        <FastImage
          source={{
            uri: buildImageUri(IMG_SIZE_L, item.img_path_prefix, item.img_path_postfix),
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <ListenCount style={styles.listenCount} article={{} as any} count={item.read_count} />
        <Text style={styles.durationText}>{Math.floor((item.media_duration_sec ?? 0) / 60)} min.</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text fontFamily="SourceSansPro-Regular" style={styles.category}>
          {item.branch0_title ?? item.branch1_title}
        </Text>
        <Text fontFamily="PlayfairDisplay-Regular" style={styles.title}>
          {item.category_title}
        </Text>
        <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.subtitle} numberOfLines={4}>
          {item.title}
        </Text>
        <TouchableDebounce style={styles.playButton} onPress={() => onItemPlayPress?.(index)}>
          <IconPlay size={10} />
        </TouchableDebounce>
      </View>
    </TouchableDebounce>
  );

  const imgUrl = buildImageUri(
    IMG_SIZE_XL,
    items[activeIndex]?.img_path_prefix,
    items[activeIndex]?.img_path_postfix,
  );

  return (
    <ThemeProvider forceTheme={themeLight}>
      <View style={styles.container}>
        {/* Blurred Background */}
        <View style={[styles.backgroundContainer, {width}]}>
          <Image source={{uri: imgUrl}} style={styles.backgroundImage} blurRadius={25} />
        </View>

        <LinearGradient
          style={StyleSheet.absoluteFillObject}
          colors={['#000000', '#00000066', '#00000033']}
          useAngle={true}
          angle={0}
        />
        {/* Logo */}
        {
          <View style={styles.logoContainer}>
            {getIconForChannelById(items[activeIndex].channel_id ?? 0, {height: 20})}
          </View>
        }

        {/* Carousel */}
        <FlatList
          ref={flatListRef}
          data={items}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item, index) => `${index}`}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {items.map((_, index) => (
            <TouchableDebounce
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              key={index}
              onPress={() => flatListRef.current?.scrollToIndex({index})}>
              <View
                key={index}
                style={[styles.paginationDot, index === activeIndex && styles.paginationDotActive]}
              />
            </TouchableDebounce>
          ))}
        </View>
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 560,
    overflow: 'hidden',
    marginVertical: 48,
  },
  backgroundContainer: {
    position: 'absolute',
    height: '100%',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
  },
  listenCount: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  slide: {
    justifyContent: 'center',
  },
  durationText: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
  },
  cardContainer: {
    alignSelf: 'center',
    width: 200,
    marginTop: 24,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderColor: '#fff',
    borderWidth: 1,
  },
  contentContainer: {
    paddingTop: 24,
    gap: 10,
    marginLeft: 60,
    marginRight: 60,
  },
  category: {
    fontSize: 14,
    marginBottom: 6,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD600',
    paddingVertical: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    aspectRatio: 1,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    left: 60,
    right: 60,
  },
  paginationDot: {
    width: 68,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 68,
    height: 4,
  },
});
