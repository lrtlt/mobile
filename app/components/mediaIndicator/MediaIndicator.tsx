import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import {IconPlay} from '../svg';

interface Props {
  style?: ViewStyle;
  size: 'small' | 'big';
}
const MediaIndicator: React.FC<React.PropsWithChildren<Props>> = ({style, size}) => {
  const {colors} = useTheme();
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
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
    backgroundColor: '#FFFFFFDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
