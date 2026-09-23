import {useMemo} from 'react';
import {useTheme} from '../../../../../Theme';

/**
 * Colors of the lrt.lt home page. Light values are taken from the web page,
 * dark values fall back to the app's dark theme.
 */
const useHomeColors = () => {
  const {colors, dark} = useTheme();

  return useMemo(
    () => ({
      text: colors.text,
      textSecondary: dark ? colors.textSecondary : '#67686E',
      description: dark ? '#C9CACF' : '#35353D',
      separator: dark ? colors.listSeparator : '#E6E6E7',
      sectionBackground: dark ? colors.slugBackground : '#F5F5F5',
      cardBackground: colors.background,
      photoBackground: colors.photoBackground,
      lightButton: dark ? colors.greyBackground : '#F0F2F5',
      darkButton: '#67686E',
      tagBorder: dark ? colors.border : '#DADEE5',
      tagHash: '#B3B3B6',
      smallBadge: dark ? '#FFFFFF26' : '#E6E6E7',
      videoPrefix: colors.mediatekaPlayButton,
      subtitle: dark ? colors.textError : '#EE000E',
    }),
    [colors, dark],
  );
};

export type HomeColors = ReturnType<typeof useHomeColors>;

export default useHomeColors;
