import {useMemo} from 'react';
import {Falsy, StyleSheet, TextStyle} from 'react-native';
import {useTheme} from '../../Theme';
import {TextComponentProps} from './Text';
import {useSettingsStore} from '../../state/settings_store';
import {useShallow} from 'zustand/react/shallow';

const DEFAULT_FONT_SIZE = 15;

const useTextStyle = ({scalingEnabled = true, type = 'primary', ...props}: TextComponentProps): TextStyle => {
  const {colors, simplyfied} = useTheme();

  const textSizeMultiplier = useSettingsStore(useShallow((state) => state.textSizeMultiplier));
  const style: TextStyle | Falsy = Array.isArray(props.style)
    ? StyleSheet.flatten(props.style)
    : (props.style as TextStyle);

  const textColor = useMemo(() => {
    switch (type) {
      case 'primary':
        return colors.text;
      case 'secondary':
        return colors.textSecondary;
      case 'disabled':
        return colors.textDisbled;
      case 'error':
        return colors.textError;
      default:
        return colors.text;
    }
  }, [colors, type]);

  const fontSize = useMemo(() => {
    let size = style?.fontSize ?? DEFAULT_FONT_SIZE;
    if (scalingEnabled) {
      const multiplier = textSizeMultiplier;
      size += multiplier ? multiplier : 0;
    }
    if (simplyfied) {
      size *= 1.2;
    }
    return size;
  }, [scalingEnabled, style?.fontSize, textSizeMultiplier]);

  return {
    ...style,
    fontSize,
    fontFamily: simplyfied ? 'Arial' : style?.fontFamily ?? props?.fontFamily ?? 'SourceSansPro-Regular',
    color: style?.color ?? textColor,
  };
};

export default useTextStyle;
