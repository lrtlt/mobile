import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';

interface Props {
  selected: boolean;
  text: string;
  onPress: () => void;
}

const SelectableItem: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: props.selected ? colors.slugBackground : undefined}}>
      <TouchableHighlight onPress={props.onPress} underlayColor={colors.greyBackground}>
        <View style={styles.container}>
          <TextComponent
            style={{...styles.text, color: props.selected ? colors.primary : undefined}}
            type="secondary">
            {props.text}
          </TextComponent>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default SelectableItem;

const styles = StyleSheet.create({
  text: {
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
