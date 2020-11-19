import React from 'react';
import {ViewPropTypes, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {debounce} from 'lodash';

const TouchableDebounce = (props) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      onPress={debounce(props.onPress, props.debounceTime, {
        leading: true,
        trailing: false,
      })}>
      {props.children}
    </TouchableOpacity>
  );
};

TouchableDebounce.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  activeOpacity: PropTypes.number,
  debounceTime: PropTypes.number,
};
TouchableDebounce.defaultProps = {
  activeOpacity: 0.5,
  style: {},
  debounceTime: 500,
};
export default TouchableDebounce;
