import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

const DefaultHeader = (props) => {
  const {colors} = useTheme();
  const {title} = props;

  return (
    <View>
      <View style={styles.sectionHeaderContainer}>
        <TextComponent style={styles.sectionHeaderText}>{title}</TextComponent>
      </View>
      <View style={{...styles.separator, backgroundColor: colors.primaryDark}} />
    </View>
  );
};

export default DefaultHeader;

const styles = StyleSheet.create({
  sectionHeaderText: {
    textTransform: 'uppercase',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 24,
    paddingBottom: 12,
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingStart: 16,
    paddingEnd: 16,
  },
  separator: {
    flex: 1,
    height: 2,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 4,
    marginBottom: 4,
  },
});
