import React from 'react';
import {Text} from 'react-native';

/**
 * TODO: find working solution
 * iOS does not support selectable text out of the box.
 */

const SelectableText = (props) => {
  return (
    <Text {...props} selectable={true}>
      {props.children}
    </Text>
  );
};

export default SelectableText;
