import React from 'react';

import {useSettings} from '../../settings/useSettings';
import {useSelector} from 'react-redux';
import {selectLogo} from '../../redux/selectors';
import {SvgCss} from 'react-native-svg';
import {LogoDark, LogoLight} from '../svg';

interface Props {
  size: number;
}

const LogoComponent: React.FC<Props> = ({size = 48}) => {
  const {isDarkMode} = useSettings();

  const logo = useSelector(selectLogo);
  if (logo?.svg) {
    return <SvgCss xml={logo?.svg} width={size} height={size} />;
  }

  return isDarkMode ? <LogoDark width={size} height={size} /> : <LogoLight width={size} height={size} />;
};

export default React.memo(LogoComponent);
