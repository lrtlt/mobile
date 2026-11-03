import {useEffect, useRef, useState} from 'react';
import {Dimensions, HostInstance} from 'react-native';

const useIsOnScreen = (enabled: boolean) => {
  const ref = useRef<HostInstance>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsOnScreen(false);
      return;
    }

    let mounted = true;
    const check = () => {
      ref.current?.measureInWindow((x, y, width, height) => {
        if (!mounted) {
          return;
        }
        if (width <= 0 || height <= 0) {
          setIsOnScreen(false);
          return;
        }
        const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
        setIsOnScreen(y < screenHeight && y + height > 0 && x < screenWidth && x + width > 0);
      });
    };

    const raf = requestAnimationFrame(check);
    const interval = setInterval(check, 400);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, [enabled]);

  return {ref, isOnScreen};
};

export default useIsOnScreen;
