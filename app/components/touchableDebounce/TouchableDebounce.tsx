import React from 'react';
import {debounce} from 'lodash';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TouchableOpacityProps} from 'react-native';
import {GenericTouchableProps} from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';

type Props = TouchableOpacityProps &
  GenericTouchableProps & {
    debounceTime?: number;
  };

const TouchableDebounce: React.FC<Props> = ({debounceTime, onPress, children, ...rest}) => {
  return (
    <TouchableOpacity
      {...rest}
      onPress={
        onPress
          ? debounce(onPress, debounceTime, {
              leading: true,
              trailing: false,
            })
          : undefined
      }>
      {children}
    </TouchableOpacity>
  );
};

TouchableDebounce.defaultProps = {
  activeOpacity: 0.7,
  debounceTime: 500,
};
export default TouchableDebounce;
