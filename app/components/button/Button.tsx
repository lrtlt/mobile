import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';

interface Props {
  style?: ViewStyle;
  onPress: () => void;
}
const Button: React.FC<Props> = (props) => {
  const {colors} = useTheme();

  return (
    <View style={props.style}>
      <BorderlessButton
        onPress={props.onPress}
        style={{...styles.container, borderColor: colors.buttonBorder}}>
        <View>{props.children}</View>
      </BorderlessButton>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
