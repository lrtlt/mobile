import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const coverImage = props => {
  // const image = props.source.uri ? (
  //   <Image style={style.img} source={props.source} resizeMode="cover" />
  // ) : null;

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
export default React.memo(coverImage);
