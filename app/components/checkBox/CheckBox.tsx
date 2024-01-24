import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Pressable, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import {IconCheck} from '../svg';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
  label?: string;
  value: boolean;
  onValueChange: (checked: boolean) => void;
}

const CheckBox: React.FC<React.PropsWithChildren<Props>> = ({style, value, onValueChange, label}) => {
  const [pressedIn, setPressedIn] = useState(false);

  const {colors} = useTheme();

  const onPressedInHandler = useCallback(() => {
    setPressedIn(true);
  }, []);

  const onPressedOutHandler = useCallback(() => {
    setPressedIn(false);
  }, []);

  const onClickHandler = useCallback(() => {
    onValueChange(!value);
  }, [onValueChange, value]);

  return (
    <Pressable
      style={[styles.root, style]}
      onPressIn={onPressedInHandler}
      onPressOut={onPressedOutHandler}
      onPress={onClickHandler}>
      <View
        style={[
          styles.clickArea,
          {
            borderColor: colors.buttonBorder,
            backgroundColor: value || pressedIn ? colors.primary : undefined,
          },
        ]}>
        {value && <IconCheck size={14} color={colors.onPrimary} />}
      </View>
      <TextComponent style={styles.label} type="secondary">
        {label}
      </TextComponent>
    </Pressable>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
  },
  clickArea: {
    height: '100%',
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    marginStart: 8,
    textTransform: 'uppercase',
  },
});
