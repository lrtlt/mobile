import React from 'react';
import {Text, TextProps} from 'react-native';

/**
 * TODO: find working solution
 * iOS does not support selectable text out of the box.
 */

interface Props extends TextProps {}

const SelectableText: React.FC<Props> = (props) => {
  return (
    <Text {...props} selectable={true}>
      {props.children}
    </Text>
  );
};

export default SelectableText;
