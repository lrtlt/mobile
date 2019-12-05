import React from 'react';
import { View } from 'react-native';
import LogoLight from './ic_logo_light';
import LogoDark from './ic_logo_dark';
import PropTypes from 'prop-types';
import { isDarkTheme } from '../../ColorTheme';

const logoComponent = props => {
  const logo = isDarkTheme() ? <LogoDark size={props.size} /> : <LogoLight size={props.size} />;

  return <View {...props}>{logo}</View>;
};

logoComponent.propTypes = {
  size: PropTypes.number.isRequired,
};

export default React.memo(logoComponent);
