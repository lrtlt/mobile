import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TextComponent from '../text/Text';

interface Props {
  iconComponent?: React.ReactNode;
  text: string;
  onPress: () => void;
}
const DrawerItem: React.FC<Props> = (props) => {
  const icon = props.iconComponent ? <View style={styles.iconContainer}>{props.iconComponent}</View> : null;

  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.5}>
      <View style={styles.container}>
        {icon}
        <TextComponent style={styles.text} type="secondary">
          {props.text}
        </TextComponent>
      </View>
    </TouchableOpacity>
  );
};

export default DrawerItem;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginStart: 10,
  },
  iconContainer: {
    paddingRight: 10,
  },
});
