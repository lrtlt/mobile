import React from 'react';
import { View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import ScalableText from '../scalableText/ScalableText';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const drawerItem = props => {
  const icon = props.iconComponent ? <View style={Styles.iconContainer}>{props.iconComponent}</View> : null;

  return (
    <RectButton
      onPress={props.onPress}
      rippleColor={EStyleSheet.value('$rippleColor')}
      underlayColor={EStyleSheet.value('$primary')}
    >
      <View style={Styles.container}>
        {icon}
        <ScalableText style={Styles.text}>{props.text}</ScalableText>
      </View>
    </RectButton>
  );
};

export default React.memo(drawerItem);
