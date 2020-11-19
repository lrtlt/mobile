import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useTheme} from '../../Theme';

const MediaIndicator = (props) => {
  const {colors} = useTheme();
  return (
    <View {...props} style={{...props.style, ...styles.container}}>
      <Icon name="play" size={14} color={colors.darkIcon} />
    </View>
  );
};

export default MediaIndicator;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
