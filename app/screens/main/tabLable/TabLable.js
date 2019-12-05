import React from 'react';
import { View, Text } from 'react-native';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Entypo';

const lable = props => {
  const style = props.focused ? Styles.labelFocused : Styles.label;

  let content;
  if (props.route.title === EStyleSheet.value('$mainWindow')) {
    content = (
      <View style={Styles.homeContainer}>
        <Icon size={20} name={'home'} color={style.color} />
      </View>
    );
  } else {
    content = <Text style={style}>{props.route.title}</Text>;
  }
  return <View style={Styles.labelContainer}>{content}</View>;
};

export default React.memo(lable);
