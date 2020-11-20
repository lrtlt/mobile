import React from 'react';
import {View} from 'react-native';
import LogoLight from './ic_logo_light';
import LogoDark from './ic_logo_dark';
import PropTypes from 'prop-types';
import {useSettings} from '../../settings/useSettings';

const LogoComponent = (props) => {
  const {isDarkMode} = useSettings();

  const logo = isDarkMode ? <LogoDark size={props.size} /> : <LogoLight size={props.size} />;

  return <View {...props}>{logo}</View>;
};

LogoComponent.propTypes = {
  size: PropTypes.number.isRequired,
};

export default LogoComponent;
