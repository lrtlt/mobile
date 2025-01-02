import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions} from 'react-native';
import Text from '../../../../../../components/text/Text';
import {IconPlay} from '../../../../../../components/svg';

const CARD_WIDTH_FULL = Math.min(Dimensions.get('window').width * 0.5, 300);
const CARD_WIDTH_MINIMAL = Math.min(Dimensions.get('window').width * 0.33, 150);

export type RadiotekaItem = {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
};

interface RadiotekaHorizontalListProps {
  data: RadiotekaItem[];
  onItemPress?: (item: RadiotekaItem) => void;
  variation?: 'full' | 'minimal';
}

const RadiotekaHorizontalList: React.FC<RadiotekaHorizontalListProps> = ({
  data,
  onItemPress,
  variation = 'full',
}) => {
  const renderItem = ({item}: {item: RadiotekaItem}) => (
    <TouchableOpacity
      style={[styles.card, variation === 'minimal' && styles.minimalCard]}
      onPress={() => onItemPress?.(item)}
      activeOpacity={0.8}>
      <View style={variation === 'minimal' ? styles.imageContainerMinimal : styles.imageContainer}>
        <ImageBackground
          source={{uri: item.imageUrl}}
          style={styles.imageBackground}
          imageStyle={styles.image}>
          {variation === 'full' && (
            <TouchableOpacity style={styles.playButton}>
              <IconPlay size={12} />
              <Text type="primary" fontFamily="SourceSansPro-Regular" style={styles.playButtonText}>
                Klausytis
              </Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>
      {variation === 'full' && (
        <View style={styles.contentContainer}>
          <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.category}>
            {item.category}
          </Text>
          <Text type="primary" fontFamily="PlayfairDisplay-Regular" style={styles.title}>
            {item.title}
          </Text>
          <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.subtitle}>
            {item.subtitle}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({offset: 0, animated: false});
    }
  }, [data]);

  return (
    <FlatList
      ref={listRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
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
    overflow: 'hidden',
  },
  imageContainer: {
    width: CARD_WIDTH_FULL,
    aspectRatio: 1,
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
    borderRadius: 8,
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
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
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
    marginTop: 16,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 13,
  },
  minimalCard: {
    width: CARD_WIDTH_MINIMAL,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default RadiotekaHorizontalList;
