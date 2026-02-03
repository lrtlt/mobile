import FastImage from '@d11/react-native-fast-image';
import {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {
  posterUri: string;
  aspectRatio: number;
}

const Poster: React.FC<PropsWithChildren<Props>> = ({posterUri, aspectRatio}) => {
  return (
    <View
      pointerEvents="none"
      style={{
        ...styles.container,
        aspectRatio: aspectRatio,
      }}>
      <FastImage source={{uri: posterUri}} style={styles.flex} resizeMode="cover" />
    </View>
  );
};

export default Poster;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none',
  },
});
