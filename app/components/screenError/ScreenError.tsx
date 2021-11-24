import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

import {useTheme} from '../../Theme';
import {IconScreenError} from '../svg';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
  text: string;
}

const ScreenError: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.container, props.style]}>
      <IconScreenError size={64} color={colors.textError} />
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

    fontSize: 20,
  },
});
