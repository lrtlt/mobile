import React from 'react';
import {View} from 'react-native';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';

const mediaIndicator = (props) => {
  return (
    <View {...props} style={{...props.style, ...Styles.container}}>
      <Icon
        name="play"
        size={EStyleSheet.value('$mediaIndicatorIconSize')}
        color={EStyleSheet.value('$darkIcon')}
      />
    </View>
  );
};

export default React.memo(mediaIndicator);
