import React, {useCallback} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import FastImage from '@d11/react-native-fast-image';

import {Article} from '../../../../../../../Types';
import {buildImageUri, IMG_SIZE_M} from '../../../../../../util/ImageUtil';
import {TouchableDebounce} from '../../../../../../components';

const width = Math.min(Dimensions.get('window').width * 0.4, 300);

interface ThumbnailItemProps {
  item: Article;
  index: number;
  isSelected: boolean;
  onPress: (index: number) => void;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = ({item, index, isSelected, onPress}) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withTiming(isSelected ? 1.05 : 1, {duration: 200});
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      borderWidth: 2,
      borderColor: isSelected ? '#FFFFFF' : 'transparent',
    };
  });

  const handlePress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <TouchableDebounce onPress={handlePress}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <FastImage
          source={{
            uri: buildImageUri(
              IMG_SIZE_M,
              item.img_path_prefix ?? item.category_img_path_prefix,
              item.img_path_postfix ?? item.category_img_path_postfix,
            ),
          }}
          style={styles.image}
        />
      </Animated.View>
    </TouchableDebounce>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    aspectRatio: 1.8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
});

export default ThumbnailItem;
