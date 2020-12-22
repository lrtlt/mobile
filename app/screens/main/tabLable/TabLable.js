import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../components';
import {IconHome} from '../../../components/svg';
import {useTheme} from '../../../Theme';

const Lable = (props) => {
  const {colors, strings} = useTheme();

  const color = props.focused ? colors.primary : colors.textSecondary;

  let content;
  if (props.route.title === strings.mainWindow) {
    content = (
      <View style={styles.homeContainer}>
        <IconHome size={18} color={color} />
      </View>
    );
  } else {
    content = <Text style={{...styles.label, color: color}}>{props.route.title}</Text>;
  }
  return <View style={styles.labelContainer}>{content}</View>;
};

export default Lable;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular',
    width: '100%',
    textTransform: 'uppercase',
  },
  homeContainer: {
    paddingStart: 6,
    paddingEnd: 6,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
