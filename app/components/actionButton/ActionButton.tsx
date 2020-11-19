import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BorderlessButton} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

interface Props {
  onPress: () => void;
}

const ActionButton: React.FC<Props> = (props) => {
  return (
    <BorderlessButton style={styles.root} onPress={props.onPress}>
      <View style={styles.clickArea}>{props.children}</View>
    </BorderlessButton>
  );
};

ActionButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default ActionButton;

const styles = StyleSheet.create({
  root: {
    margin: 4,
  },
  clickArea: {
    height: '90%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
