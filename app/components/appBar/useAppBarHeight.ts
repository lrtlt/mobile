import {getDefaultHeaderHeight} from '@react-navigation/elements';
import {Platform} from 'react-native';
import {useSafeAreaFrame, useSafeAreaInsets} from 'react-native-safe-area-context';

const useAppBarHeight = () => {
  const layout = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const hasDynamicIsland = Platform.OS === 'ios' && insets.top > 50;
  const statusBarHeight = hasDynamicIsland ? insets.top - 5 : insets.top;
  return {
    fullHeight: getDefaultHeaderHeight(layout, false, statusBarHeight),
    actionBarHeigh: getDefaultHeaderHeight(layout, false, 0),
  };
};

export default useAppBarHeight;
