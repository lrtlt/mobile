import React from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import SelectableText from '../selectableText/SelectableText';
import EStyleSheet from 'react-native-extended-stylesheet';
import {useTheme} from '../../Theme';

const DEFAULT_FONT_SIZE = 15;

type Type = 'primary' | 'secondary' | 'disabled' | 'error';

interface Props extends TextProps {
  scalingEnabled?: boolean;
  type?: Type;
}

const TextComponent: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  const propsStyle = props.style as TextStyle;

  const getColorForType = () => {
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
  };

  let fontSize = propsStyle?.fontSize ?? DEFAULT_FONT_SIZE;
  if (props.scalingEnabled) {
    const multiplier = EStyleSheet.value('$textSizeMultiplier');
    fontSize += multiplier ? multiplier : 0;
  }

  const color = propsStyle?.color ? propsStyle.color : getColorForType();
  const style: TextStyle = {...propsStyle, fontSize, color};

  if (props.selectable) {
    return <SelectableText {...props} style={style} textBreakStrategy="simple" />;
  } else {
    return <Text {...props} style={style} textBreakStrategy="simple" />;
  }
};

TextComponent.defaultProps = {
  scalingEnabled: true,
};

export default TextComponent;
