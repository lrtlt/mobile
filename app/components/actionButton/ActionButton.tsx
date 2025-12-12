import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface Props {
  style?: ViewStyle;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

const EXTRA_HIT_SLOP = 12;

const ActionButton: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <View style={[props.style, styles.root]} accessible={true} accessibilityRole="button">
      <TouchableDebounce
        style={[styles.center]}
        onPress={props.onPress}
        accessibilityLabel={props.accessibilityLabel}
        hitSlop={{
          top: EXTRA_HIT_SLOP,
          bottom: EXTRA_HIT_SLOP,
          left: EXTRA_HIT_SLOP,
          right: EXTRA_HIT_SLOP,
        }}
        accessibilityHint={props.accessibilityHint}>
        {props.children}
      </TouchableDebounce>
    </View>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
