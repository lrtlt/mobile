import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const icon = (props) => {
  return <Icon name="ios-arrow-back" size={props.size + 4} color={props.color} />;
};

icon.propTypes = {
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default icon;
