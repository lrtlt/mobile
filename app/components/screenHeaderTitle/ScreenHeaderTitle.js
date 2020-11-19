import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

const HeaderTitle = (props) => {
  const {colors} = useTheme();
  return <TextComponent style={{...styles.text, color: colors.headerTint}}>{props.children}</TextComponent>;
};

export default HeaderTitle;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
  },
});
