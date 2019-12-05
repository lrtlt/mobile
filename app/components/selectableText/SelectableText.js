import React from 'react';
import { Text, TextInput, Platform } from 'react-native';

/**
 * Selectable text implementation based on OS.
 * iOS does not support selectable text out of the box.
 * Workaround for now:
 * https://github.com/facebook/react-native/issues/13938#issuecomment-520590673
 */
const SelectableText = props => {
  if (Platform.OS === 'ios') {
    return (
      <TextInput {...props} editable={false} scrollEnabled={false} multiline={true}>
        {props.children}
      </TextInput>
    );
  } else {
    return (
      <Text {...props} selectable={true} textBreakStrategy="simple">
        {props.children}
      </Text>
    );
  }
};

export default SelectableText;
