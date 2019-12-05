import React from 'react';
import { View, Text } from 'react-native';
import Styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';

const component = props => {
  const backgroundColor = props.category.backgroundColor
    ? EStyleSheet.value(props.category.backgroundColor)
    : null;

  const extraPadding = backgroundColor ? EStyleSheet.value('$articlePadding') : 0;

  return (
    <View style={{ backgroundColor }}>
      <TouchableOpacity onPress={props.onPress}>
        <View style={{ ...Styles.container, padding: extraPadding }}>
          <Text style={Styles.title}>{EStyleSheet.value('$moreButtonText')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default component;
