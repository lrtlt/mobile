import React from 'react';

import {useSettings} from '../../settings/useSettings';
import {useSelector} from 'react-redux';
import {selectLogo} from '../../redux/selectors';
import {SvgCss} from 'react-native-svg';
import {LogoDark, LogoLight} from '../svg';

interface Props {
  width?: number;
  height?: number;
  useOnlyInternal?: boolean;
}

const LogoComponent: React.FC<Props> = ({width = 60, height = 32, useOnlyInternal = false}) => {
  const {isDarkMode} = useSettings();

  const logo = useSelector(selectLogo);
  if (logo?.svg && !useOnlyInternal) {
    return <SvgCss xml={logo?.svg} width={width} height={height} />;
  }

  return isDarkMode ? (
    <LogoDark width={width} height={height} />
  ) : (
    <LogoLight width={width} height={height} />
  );
};

export default React.memo(LogoComponent);
