import React from 'react';
import {View} from 'react-native';
import Styles from './styles';
import ScalableText from '../scalableText/ScalableText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';

const facebookReactions = (props) => {
  return (
    <View {...props} style={{...props.style, ...Styles.root}}>
      <View style={Styles.container}>
        <Icon
          style={Styles.icon}
          name="facebook"
          size={EStyleSheet.value('$facebookIconSize') + EStyleSheet.value('$textSizeMultiplier')}
          color={EStyleSheet.value('$facebook')}
        />
        <ScalableText style={Styles.countText}>{props.count}</ScalableText>
      </View>
    </View>
  );
};

export default React.memo(facebookReactions);
