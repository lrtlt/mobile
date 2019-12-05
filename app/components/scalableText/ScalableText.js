import React from 'react';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const scalableText = props => {
  const style = { ...props.style };

  const multiplier = EStyleSheet.value('$textSizeMultiplier');
  style.fontSize += multiplier ? multiplier : 0;

  return (
    <Text {...props} style={style} textBreakStrategy="simple">
      {props.children}
    </Text>
  );
};

export default scalableText;
