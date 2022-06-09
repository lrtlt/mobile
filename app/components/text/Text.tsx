import React from 'react';
import {Text, TextProps} from 'react-native';

import useTextStyle from './useTextStyle';

type Type = 'primary' | 'secondary' | 'disabled' | 'error';

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-SemiBold' | 'PlayfairDisplay-Regular';

export interface TextComponentProps extends TextProps {
  type?: Type;
  fontFamily?: FontFamily;
  scalingEnabled?: boolean;
}

const TextComponent: React.FC<TextComponentProps> = (props) => {
  const style = useTextStyle(props);
  return <Text {...props} style={style} />;
};

TextComponent.defaultProps = {
  scalingEnabled: true,
  type: 'primary',
};

export default TextComponent;
