import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import FastImage, {ResizeMode, Source} from '@d11/react-native-fast-image';
import {checkEqual} from '../../util/LodashEqualityCheck';

interface Props {
  style?: ViewStyle;
  resizeMode?: ResizeMode;
  source: Source;
}

const CoverImage: React.FC<React.PropsWithChildren<Props>> = ({style, resizeMode, source}) => {
  return (
    <View style={style}>
      {source.uri && (
        <FastImage style={styles.img} source={source} resizeMode={resizeMode ?? FastImage.resizeMode.cover} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    flex: 1,
  },
});
export default React.memo(CoverImage, checkEqual);
