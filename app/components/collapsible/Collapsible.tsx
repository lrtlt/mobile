import React from 'react';
import Animated, {SlideInLeft, SlideOutLeft} from 'react-native-reanimated';

interface Props {
  collapsed: boolean;
  duration: number;
}

const Collapsible: React.FC<React.PropsWithChildren<Props>> = ({children, collapsed, duration}) => {
  return collapsed ? null : (
    <>
      <Animated.View entering={SlideInLeft.duration(duration)} exiting={SlideOutLeft.duration(duration / 2)}>
        {children}
      </Animated.View>
    </>
  );
};

export default Collapsible;
