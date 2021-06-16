import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {debounce} from 'lodash';

interface Props {
  onPress: () => void;
  style?: ViewStyle;
  activeOpacity?: number;
  debounceTime?: number;
}

const TouchableDebounce: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...props}
      onPress={debounce(props.onPress, props.debounceTime, {
        leading: true,
        trailing: false,
      })}>
      {props.children}
    </TouchableOpacity>
  );
};

TouchableDebounce.defaultProps = {
  activeOpacity: 0.5,
  debounceTime: 500,
};
export default TouchableDebounce;
