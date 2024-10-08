import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props {
  title: string;
  color?: string;
}
const SlugHeader: React.FC<React.PropsWithChildren<Props>> = ({title, color}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.sectionHeaderContainer}>
      <TextComponent style={{...styles.sectionHeaderText, color}} fontFamily="SourceSansPro-SemiBold">
        {title}
      </TextComponent>
      <View style={{...styles.slugContainer, borderColor: color ?? colors.border + '88'}}>
        <TextComponent style={{...styles.slugText, color}} type="secondary">{`# ${title}`}</TextComponent>
      </View>
    </View>
  );
};

export default SlugHeader;

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
    height: 2,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 4,
    marginBottom: 4,
  },

  slugContainer: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'baseline',
    borderWidth: 1,
  },
  slugText: {
    fontSize: 13,
  },
});
