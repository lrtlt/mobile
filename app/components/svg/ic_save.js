import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SvgComponent = props => {
  return (
    <Icon name={props.filled ? 'bookmark' : 'bookmark-outline'} size={props.size - 2} color={props.color} />
  );
};

export default SvgComponent;
