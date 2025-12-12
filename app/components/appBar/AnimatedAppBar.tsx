import {Animated} from 'react-native';

import {HeaderOptions} from '@react-navigation/elements';
import useAppBarHeight from './useAppBarHeight';

import DefaultAppBar from './DefaultAppBar';

interface Props {
  translateY: Animated.AnimatedInterpolation<string | number>;
  onBackPress: () => void;
  headerRight?: HeaderOptions['headerRight'];
  subHeader?: React.ReactNode;
}

const AnimatedAppBar: React.FC<Props> = ({translateY, onBackPress, headerRight, subHeader}) => {
  const {fullHeight, subHeaderHeight} = useAppBarHeight();

  return (
    <Animated.View
      style={{
        height: subHeader ? fullHeight + subHeaderHeight : fullHeight,
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        transform: subHeader
          ? undefined
          : [
              {
                translateY: translateY,
              },
            ],
        zIndex: 1,
        elevation: 2,
      }}>
      <DefaultAppBar onBackPress={onBackPress} headerRight={headerRight} />
      {subHeader ? (
        <Animated.View
          style={{
            height: subHeaderHeight,
            transform: [
              {
                translateY: translateY,
              },
            ],
            zIndex: -1,
          }}>
          {subHeader}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};

export default AnimatedAppBar;
