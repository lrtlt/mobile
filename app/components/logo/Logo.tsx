import React from 'react';

import {useSettings} from '../../settings/useSettings';
import {useSelector} from 'react-redux';
import {selectLogo} from '../../redux/selectors';
import {SvgCss} from 'react-native-svg/css';
import {LogoDark, LogoLight} from '../svg';
import {themeDark} from '../../Theme';

interface Props {
  width?: number;
  height?: number;
  useOnlyInternal?: boolean;
}

const LogoComponent: React.FC<Props> = ({width = 60, height = 32, useOnlyInternal = false}) => {
  const {isDarkMode} = useSettings();

  const logo = useSelector(selectLogo);

  if (logo?.svg && !useOnlyInternal) {
    //Replace svg fill colors for dark mode to "headerTint" color
    const formattedSvg = isDarkMode
      ? logo?.svg?.replace(/fill="#(?:[0-9a-fA-F]{3}){1,2}"/g, `fill="${themeDark.colors.headerTint}"`)
      : logo?.svg;
    return <SvgCss xml={formattedSvg} width={width} height={height} />;
  }

  return isDarkMode ? (
    <LogoDark width={width} height={height} />
  ) : (
    <LogoLight width={width} height={height} />
  );
};

export default React.memo(LogoComponent);
