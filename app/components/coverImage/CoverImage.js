import React from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

const CoverImage = (props) => {
  const image = props.source.uri ? (
    <FastImage style={style.img} source={props.source} resizeMode={FastImage.resizeMode.cover} />
  ) : null;

  return <View style={props.style}>{image}</View>;
};

const style = StyleSheet.create({
  img: {
    flex: 1,
  },
});
export default CoverImage;
