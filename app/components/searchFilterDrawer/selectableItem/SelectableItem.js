import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';

const SelectableItem = (props) => {
  const {colors} = useTheme();

  return (
    <View style={props.selected === true ? {backgroundColor: colors.slugBackground} : {}}>
      <RectButton onPress={props.onPress} rippleColor={colors.ripple} underlayColor={colors.primary}>
        <View style={styles.container}>
          <TextComponent style={styles.text} type="secondary">
            {props.text}
          </TextComponent>
        </View>
      </RectButton>
    </View>
  );
};

export default SelectableItem;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginStart: 8,
  },
});
