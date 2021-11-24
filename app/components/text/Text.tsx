import React, {useMemo} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import SelectableText from '../selectableText/SelectableText';
import {useTheme} from '../../Theme';
import {useSettings} from '../../settings/useSettings';

const DEFAULT_FONT_SIZE = 15;

type Type = 'primary' | 'secondary' | 'disabled' | 'error';

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-SemiBold' | 'PlayfairDisplay-Regular';

interface Props extends TextProps {
  type?: Type;
  fontFamily?: FontFamily;
  scalingEnabled?: boolean;
}

const TextComponent: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  const {textSizeMultiplier} = useSettings();

  const style = props.style as TextStyle;

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

  const combinedStyle: TextStyle = {
    ...style,
    fontSize,
    fontFamily: style?.fontFamily ?? props?.fontFamily ?? 'SourceSansPro-Regular',
    color: style?.color ?? textColor,
  };

  if (props.selectable) {
    return <SelectableText {...props} style={combinedStyle} textBreakStrategy="highQuality" />;
  } else {
    return <Text {...props} style={combinedStyle} textBreakStrategy="highQuality" />;
  }
};

TextComponent.defaultProps = {
  scalingEnabled: true,
  type: 'primary',
};

export default TextComponent;
