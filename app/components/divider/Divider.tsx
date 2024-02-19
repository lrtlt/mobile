import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';

interface Props {
  style?: ViewStyle;
}

const Divider: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();
  return <View style={{...styles.line, backgroundColor: colors.listSeparator, ...props.style}} />;
};

export default Divider;

const styles = StyleSheet.create({
  line: {
    height: 1,
  },
});
