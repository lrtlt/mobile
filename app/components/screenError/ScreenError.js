import React from 'react';
import {View, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

const ScreenError = (props) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.container, props.style]}>
      <Icon name="error" size={40} color={colors.textError} />
      <TextComponent style={styles.text}>{props.text}</TextComponent>
    </View>
  );
};

export default ScreenError;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingTop: 16,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
  },
});
