import React from 'react';
import {View} from 'react-native';
import LogoLight from './ic_logo_light';
import LogoDark from './ic_logo_dark';
import {useSettings} from '../../settings/useSettings';

const LogoComponent = (props) => {
  const {isDarkMode} = useSettings();

  const logo = isDarkMode ? <LogoDark size={props.size} /> : <LogoLight size={props.size} />;

  return <View>{logo}</View>;
};

export default LogoComponent;
