import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

interface Props {
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

const ActionButton: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <View accessible={true} accessibilityRole="button" style={styles.root}>
      <TouchableWithoutFeedback
        onPress={props.onPress}
        accessibilityLabel={props.accessibilityLabel}
        accessibilityHint={props.accessibilityHint}>
        <View style={styles.clickArea}>{props.children}</View>
      </TouchableWithoutFeedback>
    </View>
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
