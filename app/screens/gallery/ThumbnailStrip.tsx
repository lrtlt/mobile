import React, {useEffect, useRef} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {buildArticleImageUri, IMG_SIZE_XS} from '../../util/ImageUtil';
import {ArticlePhotoType} from '../../api/Types';

const THUMB_WIDTH = 88;
const THUMB_HEIGHT = 64;
const GAP = 4;

type Props = {
  images: ArticlePhotoType[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const ThumbnailStrip: React.FC<Props> = ({images, selectedIndex, onSelect}) => {
  const listRef = useRef<FlatList<ArticlePhotoType>>(null);

  useEffect(() => {
    listRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, [selectedIndex]);

  return (
    <FlatList
      ref={listRef}
      data={images}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, i) => item.path ?? i.toString()}
      getItemLayout={(_, index) => ({
        length: THUMB_WIDTH + GAP,
        offset: (THUMB_WIDTH + GAP) * index,
        index,
      })}
      onScrollToIndexFailed={({index}) => {
        setTimeout(() => {
          listRef.current?.scrollToOffset({
            offset: (THUMB_WIDTH + GAP) * index,
            animated: false,
          });
        }, 50);
      }}
      renderItem={({item, index}) => {
        const uri = buildArticleImageUri(IMG_SIZE_XS, item.path);
        const isSelected = index === selectedIndex;
        return (
          <Pressable onPress={() => onSelect(index)} style={styles.itemWrapper}>
            <View style={[styles.imageWrapper, isSelected && styles.selected]}>
              {uri && <FastImage source={{uri}} style={styles.image} resizeMode="cover" />}
              {!isSelected && <View style={styles.dim} />}
            </View>
          </Pressable>
        );
      }}
    />
  );
};

export default ThumbnailStrip;

const styles = StyleSheet.create({
  itemWrapper: {
    marginRight: GAP,
  },
  imageWrapper: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
});
