import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';

interface Props {
  onPress: () => void;
}

const ActionButton: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <BorderlessButton style={styles.root} onPress={props.onPress}>
      <View style={styles.clickArea}>{props.children}</View>
    </BorderlessButton>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  root: {
    margin: 4,
  },
  clickArea: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
