import React from 'react';
import { View, Text } from 'react-native';
import Styles from './styles';

class TestScreen extends React.Component {
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.text}>{this.props.text}</Text>
      </View>
    );
  }
}

export default TestScreen;
