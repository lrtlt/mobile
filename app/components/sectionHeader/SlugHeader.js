import React from 'react';
import {View, Text} from 'react-native';
import ScalableText from '../scalableText/ScalableText';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const renderSlugTitle = (title) => {
  return (
    <View style={Styles.slugContainer}>
      <Text style={Styles.slugText}>{title}</Text>
    </View>
  );
};

const defaultHeader = (props) => {
  const {title, backgroundColor} = props;
  const color = EStyleSheet.value(backgroundColor);

  return (
    <View style={{backgroundColor: color}}>
      <View style={Styles.sectionHeaderContainer}>
        <ScalableText style={Styles.sectionHeaderText}>{title}</ScalableText>
        {renderSlugTitle('#' + title)}
      </View>
    </View>
  );
};

export default React.memo(defaultHeader);
