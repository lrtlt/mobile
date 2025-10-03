import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const PulsingRedDot: React.FC = () => {
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(1);

  useEffect(() => {
    const pulseAnimation = () => {
      ringScale.value = withRepeat(
        withSequence(withTiming(3, {duration: 1200, easing: Easing.out(Easing.ease)})),
        -1,
        false,
      );

      ringOpacity.value = withRepeat(
        withSequence(withTiming(0, {duration: 1200, easing: Easing.out(Easing.ease)})),
        -1,
        false,
      );
    };

    pulseAnimation();
  }, [ringScale, ringOpacity]);

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: ringScale.value}],
    opacity: ringOpacity.value,
  }));

  return (
    <Animated.View style={[styles.pulsingContainer]}>
      <Animated.View style={[styles.ring, ringAnimatedStyle]} />
      <Animated.View style={styles.dot} />
    </Animated.View>
  );
};

export default PulsingRedDot;

const styles = StyleSheet.create({
  pulsingContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FF0000',
    backgroundColor: 'transparent',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
});
