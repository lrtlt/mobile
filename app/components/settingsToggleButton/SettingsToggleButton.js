import React from 'react';
import {View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';

const button = (props) => {
  const backgroundColor = props.selected
    ? EStyleSheet.value('$toggleButtonSelected')
    : EStyleSheet.value('$windowBackground');

  return (
    <View {...props}>
      <View style={{...Styles.container, backgroundColor}}>
        <RectButton
          style={Styles.touchArea}
          rippleColor={EStyleSheet.value('$rippleColor')}
          onPress={props.onPress}>
          {props.children}
        </RectButton>
      </View>
    </View>
  );
};

export default React.memo(button);
