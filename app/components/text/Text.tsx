import React from 'react';
import {Text, TextProps} from 'react-native';
import SelectableTextUniversal from '../selectableText/SelectableTextUniversal';
import useTextStyle from './useTextStyle';

type Type = 'primary' | 'secondary' | 'disabled' | 'error';

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-SemiBold' | 'PlayfairDisplay-Regular';

export interface TextComponentProps extends TextProps {
  type?: Type;
  fontFamily?: FontFamily;
  scalingEnabled?: boolean;
  onSelected?: (selectted: boolean) => void;
}

const TextComponent: React.FC<TextComponentProps> = (props) => {
  const style = useTextStyle(props);

  if (props.selectable) {
    return <SelectableTextUniversal {...props} style={style} />;
  }
  return <Text {...props} style={style} />;
};

TextComponent.defaultProps = {
  scalingEnabled: true,
  type: 'primary',
};

export default TextComponent;
