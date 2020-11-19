import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';

const ListLoader = (props) => {
  const {colors} = useTheme();
  return (
    <View {...props} style={{...props.style, ...styles.container}}>
      <ActivityIndicator size="large" animating={true} color={colors.primary} />
    </View>
  );
};

export default ListLoader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});
