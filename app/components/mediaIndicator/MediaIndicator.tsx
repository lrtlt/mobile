import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import {IconPlay} from '../svg';

interface Props {
  style?: ViewStyle;
  size: 'small' | 'big';
}
const MediaIndicator: React.FC<Props> = ({style, size}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        width: size === 'small' ? 36 : 48,
        height: size === 'small' ? 36 : 48,
        borderRadius: size === 'small' ? 36 / 2 : 48 / 2,
        ...style,
        ...styles.container,
      }}>
      <IconPlay size={size === 'small' ? 14 : 18} color={colors.darkIcon} />
    </View>
  );
};

export default MediaIndicator;

const styles = StyleSheet.create({
  container: {
    opacity: 0.9,
    paddingStart: 4,
    backgroundColor: '#FFFFFFCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
