import React from 'react';
import {View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import ScalableText from '../../scalableText/ScalableText';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const SelectableItem = (props) => {
  return (
    <View style={props.selected === true ? Styles.rootSelected : Styles.root}>
      <RectButton
        onPress={props.onPress}
        rippleColor={EStyleSheet.value('$rippleColor')}
        underlayColor={EStyleSheet.value('$primary')}>
        <View style={Styles.container}>
          <ScalableText style={Styles.text}>{props.text}</ScalableText>
        </View>
      </RectButton>
    </View>
  );
};

export default React.memo(SelectableItem);
