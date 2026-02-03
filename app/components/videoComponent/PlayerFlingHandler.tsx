import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet} from 'react-native';
import {usePlayer} from './context/player/usePlayer';

interface Props {
  flingDistance?: number;
  children: React.ReactNode;
}

const PlayerFlingHandler: React.FC<Props> = ({flingDistance = 100, children}) => {
  const {state, actions} = usePlayer();
  const translateY = useRef(new Animated.Value(0)).current;

  const stateRef = useRef(state);
  stateRef.current = state;

  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const flingDistanceRef = useRef(flingDistance);
  flingDistanceRef.current = flingDistance;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return (
          stateRef.current.isFullScreen &&
          Math.abs(gestureState.dy) > 20 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          stateRef.current.isFullScreen &&
          Math.abs(gestureState.dy) > 20 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) >= flingDistanceRef.current) {
          actionsRef.current.toggleFullScreen();
        }
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]} {...panResponder.panHandlers}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PlayerFlingHandler;
