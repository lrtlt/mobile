import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import Text from '../../../../../../components/text/Text';
import {TouchableDebounce} from '../../../../../../components';
import FastImage from '@d11/react-native-fast-image';
import PlayButton from '../play_button/play_button';

const CARD_WIDTH = Math.min(Dimensions.get('window').width * 0.5, 300);

export type MediatekaListItem = {
  category?: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  imageAspectRatio?: string;
  isAgeRestricted?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
};

interface MediatekaHorizontalListProps {
  items: MediatekaListItem[];
  onItemPress?: (index: number) => void;
  onItemPlayPress?: (index: number) => void;
}

const MediatekaHorizontalList: React.FC<MediatekaHorizontalListProps> = ({
  items,
  onItemPress,
  onItemPlayPress,
}) => {
  const renderItem = ({item, index}: {item: MediatekaListItem; index: number}) => (
    <TouchableDebounce style={styles.card} onPress={() => onItemPress?.(index)} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <View style={styles.imageBackground}>
          <FastImage
            source={{
              uri: item.imageUrl,
            }}
            resizeMode={Number(item.imageAspectRatio) < 1 ? 'contain' : 'cover'}
            style={styles.image}
          />
          <PlayButton onPress={() => onItemPlayPress?.(index)} />
          <View style={styles.bagesContainer}>
            {item.isAgeRestricted && (
              <View style={styles.ageRestrictionBadgeContainer}>
                <Text style={{color: '#FFF', fontSize: 13}}>S</Text>
              </View>
            )}

            {item.isNew && (
              <View style={styles.newBadgeContainer}>
                <Text style={{color: '#FFF', fontSize: 13}}>Nauja</Text>
              </View>
            )}
            {item.isPopular && (
              <View style={styles.popularBadgeContainer}>
                <Text style={{color: '#FFF', fontSize: 13}}>Populiaru</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        {item.category && (
          <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.category} numberOfLines={1}>
            {item.category}
          </Text>
        )}
        {item.title && (
          <Text type="primary" fontFamily="PlayfairDisplay-Regular" style={styles.title} numberOfLines={4}>
            {item.title}
          </Text>
        )}
        {item.subtitle && (
          <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.category} numberOfLines={2}>
            {item.subtitle}
          </Text>
        )}
      </View>
    </TouchableDebounce>
  );

  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({offset: 0, animated: false});
    }
  }, [items]);

  return (
    <FlatList
      ref={listRef}
      data={items}
      renderItem={renderItem}
      keyExtractor={(_item, index) => `${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 8,
    overflow: 'visible',
  },
  imageContainer: {
    width: CARD_WIDTH,
    aspectRatio: 1.8,
    overflow: 'visible',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    backgroundColor: '#888',
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  category: {
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
  },
  bagesContainer: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  ageRestrictionBadgeContainer: {
    aspectRatio: 1,
    backgroundColor: 'rgb(239, 68, 68)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  newBadgeContainer: {
    backgroundColor: 'rgb(0, 120, 214)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 4,
  },
  popularBadgeContainer: {
    backgroundColor: 'rgb(47, 53, 125)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 4,
  },
});

export default MediatekaHorizontalList;
