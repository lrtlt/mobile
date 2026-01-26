import {View, ViewStyle, PanResponder, StyleProp, Insets} from 'react-native';
import React, {useState, useRef, PropsWithChildren} from 'react';

export interface PlayerButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeOpacity?: number | undefined;
  hitSlop?: number | Insets;
}

/**
 * The default button component that renders an image/svg source for the `react-native-theoplayer` UI.
 */
export const PlayerButton: React.FC<PropsWithChildren<PlayerButtonProps>> = ({
  style,
  onPress,
  activeOpacity,
  children,
}) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const pressedRef = useRef(false);

  const handlePressIn = () => {
    setPressed(true);
    pressedRef.current = true;
  };

  const handlePressOut = () => {
    setPressed(false);
    pressedRef.current = false;
  };

  /**
   * Use a PanResponder instead of Touchable component to fix the issue of onPress events sometimes being filtered by
   * React Native in fullscreen presentation mode on Android & iOS.
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: () => handlePressIn(),
      onPanResponderRelease: () => {
        if (pressedRef.current) {
          onPress?.();
        }
        handlePressOut();
      },
      onPanResponderTerminate: () => handlePressOut(),
      onPanResponderReject: () => handlePressOut(),
    }),
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[style, pressed && {opacity: activeOpacity ?? 0.5}]}
      accessible>
      {children}
    </View>
  );
};
