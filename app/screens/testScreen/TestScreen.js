import React from 'react';
import {View, Text} from 'react-native';
import Styles from './styles';

const TestScreen = (props) => {
  return (
    <View style={Styles.container}>
      <Text style={Styles.text}>{props.text}</Text>
    </View>
  );
};

export default TestScreen;
