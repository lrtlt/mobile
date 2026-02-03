import FastImage from '@d11/react-native-fast-image';
import {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';

interface Props {
  posterUri: string;
}

const Poster: React.FC<PropsWithChildren<Props>> = ({posterUri}) => {
  return <FastImage source={{uri: posterUri}} style={StyleSheet.absoluteFill} resizeMode="cover" />;
};

export default Poster;
