import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Animated, Image, ImageStyle} from 'react-native';
import FastImage, {ImageStyle as FastImageStyle} from 'react-native-fast-image';

interface Props {
  style?: ImageStyle & FastImageStyle;
  thumbnailSource: {
    uri?: string;
  };
  source: {
    uri?: string;
  };
  useFastImage?: boolean;
}

const ProgressiveImage: React.FC<Props> = ({style, thumbnailSource, source, useFastImage}) => {
  const [thumbnailAnimated] = useState(new Animated.Value(0));
  const [imageAnimated] = useState(new Animated.Value(0));

  const MainImageComponent = useFastImage ? FastImage : Image;

  const handleThumbnailLoad = useCallback(() => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [thumbnailAnimated]);

  const handleMainImageLoad = useCallback(() => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [imageAnimated]);

  return (
    <View style={style}>
      <Animated.View style={[{opacity: thumbnailAnimated}, style]}>
        <Image style={style} source={thumbnailSource} onLoad={handleThumbnailLoad} blurRadius={2} />
      </Animated.View>
      <Animated.View style={[styles.imageOverlay, {opacity: imageAnimated}, style]}>
        <MainImageComponent style={style} source={source} onLoad={handleMainImageLoad} />
      </Animated.View>
    </View>
  );
};

ProgressiveImage.defaultProps = {
  useFastImage: true,
};

export default ProgressiveImage;

const styles = StyleSheet.create({
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
