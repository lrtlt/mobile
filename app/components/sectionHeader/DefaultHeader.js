import React from 'react';
import {View} from 'react-native';
import ScalableText from '../scalableText/ScalableText';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const defaultHeader = (props) => {
  const {title, backgroundColor = null} = props;
  const color = EStyleSheet.value(backgroundColor);

  return (
    <View style={{backgroundColor: color}}>
      <View style={Styles.sectionHeaderContainer}>
        <ScalableText style={Styles.sectionHeaderText}>{title}</ScalableText>
      </View>
      <View style={Styles.separator} />
    </View>
  );
};

export default React.memo(defaultHeader);
