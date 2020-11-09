import React from 'react';
import {View, Text} from 'react-native';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

const error = (props) => {
  return (
    <View style={[Styles.container, props.style]}>
      <Icon name="error" size={40} color={EStyleSheet.value('$errorTextColor')} />
      <Text style={Styles.text}>{props.text}</Text>
    </View>
  );
};

export default error;
