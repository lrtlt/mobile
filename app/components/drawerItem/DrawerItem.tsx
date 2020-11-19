import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props {
  iconComponent?: React.ReactNode;
  text: string;
  onPress: () => void;
}
const DrawerItem: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  const icon = props.iconComponent ? <View style={styles.iconContainer}>{props.iconComponent}</View> : null;

  return (
    <RectButton onPress={props.onPress} rippleColor={colors.ripple} underlayColor={colors.primary}>
      <View style={styles.container}>
        {icon}
        <TextComponent style={styles.text} type="secondary">
          {props.text}
        </TextComponent>
      </View>
    </RectButton>
  );
};

export default DrawerItem;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SourceSansPro-Regular',
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
