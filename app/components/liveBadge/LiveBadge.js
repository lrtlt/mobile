import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';

const badge = props => {
  return (
    <View style={[Styles.container, props.style]}>
      <Text style={Styles.text}> {EStyleSheet.value('$liveChannelTitle')} </Text>
    </View>
  );
};

export default badge;
