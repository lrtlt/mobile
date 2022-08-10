import React from 'react';
import {Text, TextProps} from 'react-native';
import {useTheme} from '../../Theme';

interface Props extends TextProps {}

const COLOR_ALPHA = '50';

const SelectableText: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  return (
    <Text {...props} selectable={true} selectionColor={`${colors.primary}${COLOR_ALPHA}`}>
      {props.children}
    </Text>
  );
};

export default SelectableText;
