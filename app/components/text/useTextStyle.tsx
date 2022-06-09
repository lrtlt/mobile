import {useMemo} from 'react';
import {Falsy, StyleSheet, TextStyle} from 'react-native';
import {useSettings} from '../../settings/useSettings';
import {useTheme} from '../../Theme';
import {TextComponentProps} from './Text';

const DEFAULT_FONT_SIZE = 15;

const useTextStyle = (props: TextComponentProps): TextStyle => {
  const {colors} = useTheme();
  const {textSizeMultiplier} = useSettings();

  const style: TextStyle | Falsy = Array.isArray(props.style)
    ? StyleSheet.flatten(props.style)
    : (props.style as TextStyle);

  const textColor = useMemo(() => {
    switch (props.type) {
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
  }, [colors, props.type]);

  const fontSize = useMemo(() => {
    let size = style?.fontSize ?? DEFAULT_FONT_SIZE;
    if (props.scalingEnabled) {
      const multiplier = textSizeMultiplier;
      size += multiplier ? multiplier : 0;
    }
    return size;
  }, [props.scalingEnabled, style?.fontSize, textSizeMultiplier]);

  return {
    ...style,
    fontSize,
    fontFamily: style?.fontFamily ?? props?.fontFamily ?? 'SourceSansPro-Regular',
    color: style?.color ?? textColor,
  };
};

export default useTextStyle;
