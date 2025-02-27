import React, {PropsWithChildren} from 'react';
import {GenreArticle} from '../../api/Types';
import FastImage from 'react-native-fast-image';
import {TouchableDebounce} from '../../components';
import {StyleSheet, View} from 'react-native';
import {buildImageUri, IMG_SIZE_M} from '../../util/ImageUtil';

interface Props {
  shows: GenreArticle[];
  onItemPress?: (index: number) => void;
}

const GenrePodcastGrid: React.FC<PropsWithChildren<Props>> = ({shows, onItemPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {shows.map((item, index) => {
          const imageUrl = buildImageUri(IMG_SIZE_M, item.image.prefix, item.image.postfix);
          return (
            <View key={item.id.toString()} style={styles.gridItem}>
              <GridImage image={imageUrl} onPress={() => onItemPress?.(index)} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const GridImage: React.FC<{image: string; onPress?: () => void}> = ({image, onPress}) => {
  return (
    <TouchableDebounce style={[styles.card, styles.minimalCard]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainerMinimal}>
        <View style={styles.imageBackground}>
          <FastImage
            source={{
              uri: image,
            }}
            style={styles.image}
          />
        </View>
      </View>
    </TouchableDebounce>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    marginBottom: 12,
  },
  card: {
    borderRadius: 8,
    overflow: 'visible',
  },
  imageContainerMinimal: {
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
  minimalCard: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default GenrePodcastGrid;
