import React from 'react';
import {Text} from 'react-native';
import SelectableText from '../selectableText/SelectableText';
import EStyleSheet from 'react-native-extended-stylesheet';

const scalableText = (props) => {
  const style = {...props.style};

  const multiplier = EStyleSheet.value('$textSizeMultiplier');
  style.fontSize += multiplier ? multiplier : 0;

  const TextComponent = props.selectable === true ? SelectableText : Text;
  return (
    <TextComponent {...props} style={style} textBreakStrategy="simple">
      {props.children}
    </TextComponent>
  );
};

export default scalableText;
