import React from 'react';
import {View, StyleSheet} from 'react-native';
import TextComponent from '../text/Text';
import Divider from '../divider/Divider';

interface Props {
  title?: string;
}

const DefaultHeader: React.FC<React.PropsWithChildren<Props>> = ({title}) => {
  return (
    <View>
      <View style={styles.sectionHeaderContainer}>
        <TextComponent style={styles.sectionHeaderText} fontFamily="SourceSansPro-SemiBold">
          {title}
        </TextComponent>
      </View>
      <Divider style={{flex: 1, margin: 8}} />
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
});
