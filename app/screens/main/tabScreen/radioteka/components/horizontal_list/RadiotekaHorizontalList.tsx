import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import Text from '../../../../../../components/text/Text';
import {TouchableDebounce} from '../../../../../../components';
import FastImage from 'react-native-fast-image';
import PlayButton from '../play_button/play_button';

const CARD_WIDTH_FULL = Math.min(Dimensions.get('window').width * 0.5, 300);
const CARD_WIDTH_MINIMAL = Math.min(Dimensions.get('window').width * 0.33, 150);

export type RadiotekaListItem = {
  category?: string;
  title: string;
  imageUrl: string;
};

interface RadiotekaHorizontalListProps {
  items: RadiotekaListItem[];
  onItemPress?: (index: number) => void;
  onItemPlayPress?: (index: number) => void;
  variation?: 'full' | 'minimal';
}

const RadiotekaHorizontalList: React.FC<RadiotekaHorizontalListProps> = ({
  items,
  onItemPress,
  onItemPlayPress,
  variation = 'full',
}) => {
  const renderItem = ({item, index}: {item: RadiotekaListItem; index: number}) => (
    <TouchableDebounce
      style={[styles.card, variation === 'minimal' && styles.minimalCard]}
      onPress={() => onItemPress?.(index)}
      activeOpacity={0.8}>
      <View style={variation === 'minimal' ? styles.imageContainerMinimal : styles.imageContainer}>
        <View style={styles.imageBackground}>
          <FastImage
            source={{
              uri: item.imageUrl,
            }}
            style={styles.image}
          />
          {variation === 'full' && <PlayButton onPress={() => onItemPlayPress?.(index)} />}
        </View>
      </View>
      {variation === 'full' && (
        <View style={styles.contentContainer}>
          <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.category} numberOfLines={1}>
            {item.category}
          </Text>
          <Text type="primary" fontFamily="PlayfairDisplay-Regular" style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      )}
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
    width: CARD_WIDTH_FULL,
    borderRadius: 8,
    overflow: 'visible',
  },
  imageContainer: {
    width: CARD_WIDTH_FULL,
    aspectRatio: 1,
    overflow: 'visible',
  },
  imageContainerMinimal: {
    width: CARD_WIDTH_MINIMAL,
    aspectRatio: 1,
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
    fontSize: 19,
    marginBottom: 6,
  },
  minimalCard: {
    width: CARD_WIDTH_MINIMAL,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default RadiotekaHorizontalList;
