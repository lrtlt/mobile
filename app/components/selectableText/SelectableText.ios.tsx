import React from 'react';
import {TextInput, TextProps} from 'react-native';
import {useTheme} from '../../Theme';

interface Props extends TextProps {}

const SelectableText: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  return (
    <TextInput
      {...props}
      multiline={true}
      scrollEnabled={false}
      editable={false}
      dataDetectorTypes={['all']}
      selectionColor={colors.primary}
    />
  );
};

export default SelectableText;
