import React from 'react';

import {useSettings} from '../../settings/useSettings';
import {useSelector} from 'react-redux';
import {selectLogo} from '../../redux/selectors';
import {SvgCss} from 'react-native-svg/css';
import {LRTLogo} from '../svg';
import {themeDark, useTheme} from '../../Theme';

interface Props {
  width?: number;
  height?: number;
  useOnlyInternal?: boolean;
}

const LogoComponent: React.FC<React.PropsWithChildren<Props>> = ({
  width = 60,
  height = 32,
  useOnlyInternal = false,
}) => {
  const {isDarkMode} = useSettings();
  const {colors} = useTheme();

  const logo = useSelector(selectLogo);

  if (logo?.svg && !useOnlyInternal) {
    //Replace svg fill colors for dark mode to "headerTint" color
    const formattedSvg = isDarkMode
      ? logo?.svg?.replace(/fill="#(?:[0-9a-fA-F]{3}){1,2}"/g, `fill="${themeDark.colors.headerTint}"`)
      : logo?.svg;
    return <SvgCss xml={formattedSvg} width={width} height={height} />;
  }

  return <LRTLogo height={height} color={colors.headerTint} />;
};

export default React.memo(LogoComponent);
