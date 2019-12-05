import React from 'react';
import { View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const button = props => {
  return (
    <View {...props}>
      <BorderlessButton
        onPress={props.onPress}
        style={Styles.container}
        underlayColor={EStyleSheet.value('$buttonBorderColor')}
      >
        <View>{props.children}</View>
      </BorderlessButton>
    </View>
  );
};

export default React.memo(button);
