import React from 'react';
import { View } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import Styles from './styles';

const button = props => {
  return (
    <View {...props}>
      <View style={Styles.touchArea}>
        <BaseButton style={Styles.container} onPress={props.onPress}>
          {props.children}
        </BaseButton>
      </View>
    </View>
  );
};

export default button;
