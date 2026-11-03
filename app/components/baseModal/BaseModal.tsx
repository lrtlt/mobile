import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';

const ANIMATION_DURATION = 250;

interface Props {
  isVisible: boolean;
  style?: StyleProp<ViewStyle>;
  backdropOpacity?: number;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
  avoidKeyboard?: boolean;
  statusBarTranslucent?: boolean;
}

const BaseModal: React.FC<PropsWithChildren<Props>> = ({
  isVisible,
  style,
  backdropOpacity = 0.7,
  onBackdropPress,
  onBackButtonPress,
  avoidKeyboard = false,
  statusBarTranslucent,
  children,
}) => {
  const {width, height} = useWindowDimensions();
  const [isMounted, setIsMounted] = useState(isVisible);
  const isVisibleRef = useRef(isVisible);
  const progress = useSharedValue(0);

  const onHidden = useCallback(() => {
    if (!isVisibleRef.current) {
      setIsMounted(false);
    }
  }, []);

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (isVisible) {
      setIsMounted(true);
      progress.value = withTiming(1, {duration: ANIMATION_DURATION});
    } else {
      progress.value = withTiming(0, {duration: ANIMATION_DURATION}, (finished) => {
        if (finished) {
          scheduleOnRN(onHidden);
        }
      });
    }
  }, [isVisible, progress, onHidden]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * backdropOpacity,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{translateY: (1 - progress.value) * height}],
  }));

  const content = (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.content, {margin: width * 0.05}, style, contentStyle]}>
      {children}
    </Animated.View>
  );

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isMounted}
      statusBarTranslucent={statusBarTranslucent}
      onRequestClose={onBackButtonPress}>
      <Pressable style={StyleSheet.absoluteFill} accessible={false} onPress={onBackdropPress}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
      </Pressable>
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none">
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </Modal>
  );
};

export default BaseModal;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
