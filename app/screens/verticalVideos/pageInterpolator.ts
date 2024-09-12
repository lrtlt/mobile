import {PageInterpolatorParams} from 'react-native-infinite-pager';
import {interpolate} from 'react-native-reanimated';

export function pageInterpolatorTurnIn({focusAnim, pageWidth, pageHeight, vertical}: PageInterpolatorParams) {
  'worklet';

  const translateX = interpolate(
    focusAnim.value,
    [-1, 0, 1],
    vertical ? [0, 0, 0] : [-pageWidth.value, 0, pageWidth.value],
  );

  const translateY = interpolate(
    focusAnim.value,
    [-1, 0, 1],
    vertical ? [-pageHeight.value * 0.5, 0, pageHeight.value * 0.5] : [0, 0, 0],
  );

  // const scale = interpolate(focusAnim.value, [-1, 0, 1], [0.9, 1, 0.9]);
  // const rotateY = interpolate(focusAnim.value, [-1, 1], vertical ? [0, 0] : [75, -75], Extrapolation.CLAMP);
  // const rotateX = interpolate(focusAnim.value, [-1, 1], vertical ? [-75, 75] : [0, 0], Extrapolation.CLAMP);

  return {
    transform: [
      {perspective: 1000},
      {translateX},
      {translateY},
      // {rotateY: `${rotateY}deg`},
      // {rotateX: `${rotateX}deg`},
      // {scale},
    ],
  };
}
