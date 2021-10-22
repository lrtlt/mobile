import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {debounce} from 'lodash';

interface Props extends TouchableOpacityProps {
  debounceTime?: number;
}

const TouchableDebounce: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      {...props}
      onPress={debounce(props.onPress!, props.debounceTime, {
        leading: true,
        trailing: false,
      })}>
      {props.children}
    </TouchableOpacity>
  );
};

TouchableDebounce.defaultProps = {
  activeOpacity: 0.7,
  debounceTime: 500,
};
export default TouchableDebounce;
