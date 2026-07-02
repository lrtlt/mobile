import {View, ViewStyle, PanResponder, Platform, StyleProp, Insets} from 'react-native';
import React, {useState, useRef, PropsWithChildren} from 'react';

export interface PlayerButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeOpacity?: number | undefined;
  hitSlop?: number | Insets;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * The default button component that renders an image/svg source for the `react-native-theoplayer` UI.
 */
export const PlayerButton: React.FC<PropsWithChildren<PlayerButtonProps>> = ({
  style,
  onPress,
  activeOpacity,
  accessibilityLabel,
  accessibilityHint,
  children,
}) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const pressedRef = useRef(false);

  // The PanResponder is created once, so read the latest onPress through a ref
  // instead of capturing the first render's callback.
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

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
      // Blocking the native responder (the Android default) makes the native side cancel
      // the touch stream right after the grant on RN 0.86 new architecture when the player
      // is inline, so the finger-up never reaches JS and RELEASE never fires.
      onShouldBlockNativeResponder: () => Platform.OS !== 'android',
      onPanResponderGrant: () => handlePressIn(),
      onPanResponderRelease: () => {
        if (pressedRef.current) {
          onPressRef.current?.();
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
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}>
      {children}
    </View>
  );
};
