import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../components';

const TestScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} type="secondary">
        {props.text}
      </Text>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
  },
});
