import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Left/right safe area insets for scrolling content.
 *
 * In portrait only devices with a side camera strip (e.g. iPhone Duo) report side insets, and the strip
 * covers just the top corner, so content runs full width and scrolls under it like under the status bar.
 * In landscape the notch or Dynamic Island covers a whole side, so the insets apply.
 */
const useContentSideInsets = () => {
  const {left, right} = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  return width > height ? {left, right} : {left: 0, right: 0};
};

/**
 * Extra left/right margin for bars (e.g. tab bars) placed inside content padded with useContentSideInsets.
 * Bars sit next to the camera strip, so together with the content insets they always clear the full safe area.
 */
export const useBarSideMargins = () => {
  const insets = useSafeAreaInsets();
  const content = useContentSideInsets();
  return {marginLeft: insets.left - content.left, marginRight: insets.right - content.right};
};

export default useContentSideInsets;
