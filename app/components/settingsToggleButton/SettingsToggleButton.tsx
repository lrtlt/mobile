import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface Props {
  style?: ViewStyle;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}
const ToggleButton: React.FC<React.PropsWithChildren<Props>> = ({style, selected, onPress, ...props}) => {
  const {colors} = useTheme();

  const backgroundColor = selected ? colors.toggleButtonSelected : colors.background;

  return (
    <View style={style} accessible={false}>
      <View
        style={{...styles.container, backgroundColor, borderColor: colors.buttonBorder}}
        accessible={false}>
        <TouchableDebounce
          style={styles.touchArea}
          onPress={onPress}
          accessibilityLabel={props.accessibilityLabel}>
          {props.children}
        </TouchableDebounce>
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
