import React from 'react';
import {View, StyleSheet, Animated, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },
});

class ProgressiveImage extends React.Component {
  thumbnailAnimated = new Animated.Value(0);

  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
      duration: 150,
    }).start();
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
      duration: 250,
    }).start();
  };

  render() {
    const {thumbnailSource, source, style, ...props} = this.props;

    const MainImage = this.props.useFastImage === false ? Image : FastImage;
    return (
      <View style={style}>
        <Animated.View {...props} style={[{opacity: this.thumbnailAnimated}, style]}>
          <Image style={style} source={thumbnailSource} onLoad={this.handleThumbnailLoad} blurRadius={2} />
        </Animated.View>
        <Animated.View {...props} style={[styles.imageOverlay, {opacity: this.imageAnimated}, style]}>
          <MainImage style={style} source={source} onLoad={this.onImageLoad} />
        </Animated.View>
      </View>
    );
  }
}

export default ProgressiveImage;
