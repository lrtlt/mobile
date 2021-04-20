import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';

interface Props {
  style?: ViewStyle;
  source: Source;
}

const CoverImage: React.FC<Props> = ({style, source}) => {
  return (
    <View style={style}>
      {source.uri && <FastImage style={styles.img} source={source} resizeMode={FastImage.resizeMode.cover} />}
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    flex: 1,
  },
});
export default CoverImage;
