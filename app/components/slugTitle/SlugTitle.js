import React from 'react';
import { View, Text } from 'react-native';
import Styles from './styles';

const slugTitle = props => {
  return (
    <View style={Styles.container}>
      <Text style={Styles.text}>{props.title}</Text>
    </View>
  );
};

export default React.memo(slugTitle);
