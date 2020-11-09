import React from 'react';
import {View} from 'react-native';
import Styles from './styles';
import Text from '../scalableText/ScalableText';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

const photoCount = (props) => {
  return (
    <View {...props} style={{...props.style, ...Styles.container}}>
      <Icon
        name="photo-camera"
        size={EStyleSheet.value('$photoBadgeIconSize') + EStyleSheet.value('$textSizeMultiplier')}
        color={EStyleSheet.value('$darkIcon')}
      />
      <Text style={Styles.countText}>{props.count}</Text>
    </View>
  );
};

export default React.memo(photoCount);
