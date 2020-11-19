import React from 'react';
import {Text} from 'react-native';
import SelectableText from '../selectableText/SelectableText';
import EStyleSheet from 'react-native-extended-stylesheet';

/** @deprecated Use Text.tsx instead */
const scalableText = (props) => {
  const style = {...props.style};

  const multiplier = EStyleSheet.value('$textSizeMultiplier');
  style.fontSize += multiplier ? multiplier : 0;

  if (props.selectable) {
    return <SelectableText {...props} style={style} textBreakStrategy="simple" />;
  } else {
    return <Text {...props} style={style} textBreakStrategy="simple" />;
  }
};

export default scalableText;
