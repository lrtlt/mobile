import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ViewToken,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {RadiotekaItem} from '../horizontal_list/RadiotekaHorizontalList';
import Text from '../../../../../../components/text/Text';
import {ChannelClassicIcon, IconPlay} from '../../../../../../components/svg';
import FastImage from 'react-native-fast-image';
import ListenCount from '../../../../../../components/article/article/ListenCount';

interface RadiotekaHeroCarouselProps {
  items: RadiotekaItem[];
  onItemPress?: (item: RadiotekaItem) => void;
}

export const RadiotekaHeroCarousel: React.FC<RadiotekaHeroCarouselProps> = ({items, onItemPress}) => {
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

  const renderItem = ({item}: {item: RadiotekaItem}) => (
    <TouchableOpacity style={[styles.slide, {width}]} onPress={() => onItemPress?.(item)} activeOpacity={0.8}>
      <View style={styles.cardContainer}>
        <FastImage source={{uri: item.imageUrl}} style={styles.image} resizeMode="cover" />
        {
          //TODO: Change to actual article instead count
        }
        <ListenCount style={styles.listenCount} article={{} as any} count={120} />
        <Text style={styles.durationText}>1 val. 15 min.</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text fontFamily="SourceSansPro-Regular" style={styles.category}>
          {item.category}
        </Text>
        <Text fontFamily="PlayfairDisplay-Regular" style={styles.title}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text fontFamily="SourceSansPro-Regular" style={styles.subtitle}>
            {item.subtitle}
          </Text>
        )}
        <TouchableOpacity style={styles.playButton}>
          <IconPlay size={10} />
          <Text type="primary" fontFamily="SourceSansPro-Regular" style={styles.playButtonText}>
            Klausytis
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Blurred Background */}
      <View style={[styles.backgroundContainer, {width}]}>
        <Image source={{uri: items[activeIndex]?.imageUrl}} style={styles.backgroundImage} blurRadius={25} />
        <View style={styles.overlay} />
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <ChannelClassicIcon height={20} />
      </View>

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
        keyExtractor={(item) => item.id}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {items.map((_, index) => (
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            key={index}
            onPress={() => flatListRef.current?.scrollToIndex({index})}>
            <View
              key={index}
              style={[styles.paginationDot, index === activeIndex && styles.paginationDotActive]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 525,
    overflow: 'hidden',
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
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
    width: 194,
    marginTop: 24,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imageBackground: {
    flex: 1,
    padding: 12,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderColor: '#fff',
    borderWidth: 2,
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
    fontSize: 14,
    opacity: 0.8,
    color: '#FFFFFF',
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 13,
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
