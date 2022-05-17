import React, {useMemo} from 'react';
import {debounce} from 'lodash';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {GenericTouchableProps} from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';

type Props = TouchableOpacityProps &
  GenericTouchableProps & {
    debounceTime?: number;
  };

const noOp = () => {};

const TouchableDebounce: React.FC<Props> = ({debounceTime, onPress, children, ...rest}) => {
  const debouncedOnPress = useMemo(
    () =>
      debounce(onPress ?? noOp, debounceTime, {
        leading: true,
        trailing: false,
      }),
    [debounceTime, onPress],
  );

  return (
    <TouchableOpacity {...rest} onPress={debouncedOnPress}>
      {children}
    </TouchableOpacity>
  );
};

TouchableDebounce.defaultProps = {
  activeOpacity: 0.7,
  debounceTime: 500,
};
export default TouchableDebounce;
