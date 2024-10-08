import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props {
  title?: string;
}

const DefaultHeader: React.FC<React.PropsWithChildren<Props>> = ({title}) => {
  const {colors} = useTheme();

  return (
    <View>
      <View style={styles.sectionHeaderContainer}>
        <TextComponent style={styles.sectionHeaderText} fontFamily="SourceSansPro-SemiBold">
          {title}
        </TextComponent>
      </View>
      <View style={{...styles.separator, backgroundColor: colors.primaryDark}} />
    </View>
  );
};

export default DefaultHeader;

const styles = StyleSheet.create({
  sectionHeaderText: {
    textTransform: 'uppercase',
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
    height: StyleSheet.hairlineWidth,
    marginStart: 8,
    marginEnd: 8,
    marginBottom: 4,
  },
});
