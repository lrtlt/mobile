import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';

const Button = (props) => {
  const {colors} = useTheme();

  return (
    <View {...props}>
      <BorderlessButton
        onPress={props.onPress}
        style={{...styles.container, borderColor: colors.buttonBorder}}
        underlayColor={colors.buttonBorder}>
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
