import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import {IconPlay} from '../svg';

const MediaIndicator = (props) => {
  const {colors} = useTheme();
  return (
    <View {...props} style={{...props.style, ...styles.container}}>
      <IconPlay size={14} color={colors.darkIcon} />
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
