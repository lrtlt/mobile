import React from 'react';
import {View} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import Styles from './styles';

const ActionButton = (props) => {
  return (
    <BorderlessButton style={Styles.root} onPress={props.onPress}>
      <View style={Styles.clickArea}>{props.children}</View>
    </BorderlessButton>
  );
};

ActionButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default ActionButton;
