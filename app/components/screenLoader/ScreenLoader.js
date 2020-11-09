import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const loader = (props) => {
  return (
    <View style={[Styles.container, props.style]}>
      <ActivityIndicator size="large" animating={true} color={EStyleSheet.value('$buttonContentColor')} />
    </View>
  );
};

export default loader;
