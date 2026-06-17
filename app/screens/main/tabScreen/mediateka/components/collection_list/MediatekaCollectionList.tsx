import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Text from '../../../../../../components/text/Text';
import {TouchableDebounce} from '../../../../../../components';
import {useTheme} from '../../../../../../Theme';

const CARD_WIDTH = Math.min(Dimensions.get('window').width * 0.53, 240);

export type MediatekaCollectionItem = {
  imageUrl: string;
};

interface MediatekaCollectionListProps {
  title: string;
  items: MediatekaCollectionItem[];
  separatorTop?: boolean;
  onItemPress?: (index: number) => void;
}

const MediatekaCollectionList: React.FC<MediatekaCollectionListProps> = ({
  title,
  items,
  separatorTop = true,
  onItemPress,
}) => {
  const {colors} = useTheme();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({offset: 0, animated: false});
    }
  }, [items]);

  const renderItem = ({item, index}: {item: MediatekaCollectionItem; index: number}) => (
    <TouchableDebounce style={styles.card} onPress={() => onItemPress?.(index)} activeOpacity={0.8}>
      <FastImage source={{uri: item.imageUrl}} resizeMode="cover" style={styles.image} />
    </TouchableDebounce>
  );

  return (
    <View style={styles.container}>
      {separatorTop && (
        <View style={{height: StyleSheet.hairlineWidth, backgroundColor: colors.listSeparator}} />
      )}
      <View style={styles.header}>
        <Text type="primary" fontFamily="SourceSansPro-SemiBold" style={styles.title}>
          {title}
        </Text>
      </View>
      <FlatList
        ref={listRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(_item, index) => `${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    textTransform: 'uppercase',
  },
  listContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    aspectRatio: 0.7,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#888',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
});

export default MediatekaCollectionList;
