import React, {useCallback} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  clamp,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import FastImage from '@d11/react-native-fast-image';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

type Props = {
  uri: string;
  width: number;
  height: number;
  onZoomChange?: (zoomed: boolean) => void;
};

const ZoomableImage: React.FC<Props> = ({uri, width, height, onZoomChange}) => {
  const {width: screenWidth} = useWindowDimensions();
  const containerWidth = width || screenWidth;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const notifyZoom = useCallback(
    (zoomed: boolean) => {
      onZoomChange?.(zoomed);
    },
    [onZoomChange],
  );

  const clampTranslation = (s: number, tx: number, ty: number) => {
    'worklet';
    const maxX = Math.max(0, (containerWidth * (s - 1)) / 2);
    const maxY = Math.max(0, (height * (s - 1)) / 2);
    return {
      x: clamp(tx, -maxX, maxX),
      y: clamp(ty, -maxY, maxY),
    };
  };

  const resetZoom = () => {
    'worklet';
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    runOnJS(notifyZoom)(false);
  };

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX - containerWidth / 2;
      focalY.value = e.focalY - height / 2;
      runOnJS(notifyZoom)(true);
    })
    .onUpdate((e) => {
      const next = clamp(savedScale.value * e.scale, 0.8, MAX_SCALE);
      scale.value = next;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        resetZoom();
        return;
      }
      savedScale.value = scale.value;
      const c = clampTranslation(scale.value, translateX.value, translateY.value);
      translateX.value = withTiming(c.x);
      translateY.value = withTiming(c.y);
      savedTranslateX.value = c.x;
      savedTranslateY.value = c.y;
    });

  const pan = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .onUpdate((e) => {
      if (scale.value <= 1) {
        return;
      }
      const c = clampTranslation(
        scale.value,
        savedTranslateX.value + e.translationX,
        savedTranslateY.value + e.translationY,
      );
      translateX.value = c.x;
      translateY.value = c.y;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd((e) => {
      if (scale.value > 1) {
        resetZoom();
      } else {
        scale.value = withTiming(DOUBLE_TAP_SCALE);
        savedScale.value = DOUBLE_TAP_SCALE;
        const tx = -(e.x - containerWidth / 2) * (DOUBLE_TAP_SCALE - 1);
        const ty = -(e.y - height / 2) * (DOUBLE_TAP_SCALE - 1);
        const c = clampTranslation(DOUBLE_TAP_SCALE, tx, ty);
        translateX.value = withTiming(c.x);
        translateY.value = withTiming(c.y);
        savedTranslateX.value = c.x;
        savedTranslateY.value = c.y;
        runOnJS(notifyZoom)(true);
      }
    });

  const composed = Gesture.Race(doubleTap, Gesture.Simultaneous(pinch, pan));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.container, {width: containerWidth, height}]}>
        <AnimatedFastImage
          source={{uri}}
          style={[styles.image, animatedStyle]}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomableImage;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
