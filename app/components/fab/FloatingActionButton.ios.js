import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Styles from './styles';

const button = (props) => {
  return (
    <View {...props}>
      <View style={Styles.touchArea}>
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.4}>
          <View style={Styles.container}>{props.children}</View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default button;
