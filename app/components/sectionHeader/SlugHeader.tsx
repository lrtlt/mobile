import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props {
  title: string;
}
const SlugHeader: React.FC<Props> = ({title}) => {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.slugBackground}}>
      <View style={styles.sectionHeaderContainer}>
        <TextComponent style={styles.sectionHeaderText}>{title}</TextComponent>
        <View style={{...styles.slugContainer, borderColor: colors.border}}>
          <TextComponent style={styles.slugText}>{`# ${title}`}</TextComponent>
        </View>
      </View>
    </View>
  );
};

export default SlugHeader;

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

  slugContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'baseline',
    borderWidth: 1,
  },
  slugText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
  },
});
