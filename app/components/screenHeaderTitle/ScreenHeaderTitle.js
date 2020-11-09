import React from 'react';
import {Text} from 'react-native';

import Styles from './styles';

const title = (props) => {
  return <Text style={Styles.text}>{props.children}</Text>;
};

export default title;
