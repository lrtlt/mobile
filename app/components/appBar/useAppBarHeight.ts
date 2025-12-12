import {useSafeAreaInsets} from 'react-native-safe-area-context';

const APP_BAR_HEIGHT = 64;

const useAppBarHeight = () => {
  const insets = useSafeAreaInsets();
  return {
    fullHeight: insets.top + APP_BAR_HEIGHT,
    actionBarHeigh: APP_BAR_HEIGHT,
    subHeaderHeight: 62,
  };
};

export default useAppBarHeight;
