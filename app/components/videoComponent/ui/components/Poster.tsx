import FastImage from '@d11/react-native-fast-image';
import {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';

interface Props {
  posterUri: string;
}

const Poster: React.FC<PropsWithChildren<Props>> = ({posterUri}) => {
  return <FastImage source={{uri: posterUri}} style={styles.img} resizeMode="cover" />;
};

export default Poster;

const styles = StyleSheet.create({
  img: {
    flex: 1,
    position: 'absolute',
  },
});
