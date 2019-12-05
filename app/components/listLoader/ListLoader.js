import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const loader = props => {
  return (
    <View {...props} style={{ ...props.style, ...Styles.container }}>
      <ActivityIndicator
        style={Styles.loader}
        size="large"
        animating={true}
        color={EStyleSheet.value('$primary')}
      />
    </View>
  );
};

export default React.memo(loader);
