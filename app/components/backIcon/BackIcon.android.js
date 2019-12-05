import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

const icon = props => {
  return <Icon name="arrow-back" size={props.size} color={props.color} />;
};

icon.propTypes = {
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default icon;
