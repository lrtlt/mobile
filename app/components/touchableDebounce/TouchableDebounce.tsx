import React, {useMemo} from 'react';
import {debounce} from 'lodash';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {GenericTouchableProps} from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchableProps';

type Props = TouchableOpacityProps &
  GenericTouchableProps & {
    debounceTime?: number;
  };

const noOp = () => {};

const TouchableDebounce: React.FC<React.PropsWithChildren<Props>> = ({
  debounceTime = 500,
  activeOpacity = 0.7,
  onPress,
  children,
  ...rest
}) => {
  const debouncedOnPress = useMemo(() => {
    const handler = typeof onPress === 'function' ? onPress : noOp;
    return debounce(handler, debounceTime, {
      leading: true,
      trailing: false,
    });
  }, [debounceTime, onPress]);

  return (
    <TouchableOpacity {...rest} onPress={debouncedOnPress} activeOpacity={activeOpacity}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableDebounce;
