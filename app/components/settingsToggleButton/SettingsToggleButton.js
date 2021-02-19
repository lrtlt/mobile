import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';

const ToggleButton = (props) => {
  const {colors} = useTheme();

  const backgroundColor = props.selected ? colors.toggleButtonSelected : colors.background;

  return (
    <View {...props}>
      <View style={{...styles.container, backgroundColor, borderColor: colors.buttonBorder}}>
        <RectButton style={styles.touchArea} rippleColor={colors.ripple} onPress={props.onPress}>
          {props.children}
        </RectButton>
      </View>
    </View>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
  },
  touchArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});
