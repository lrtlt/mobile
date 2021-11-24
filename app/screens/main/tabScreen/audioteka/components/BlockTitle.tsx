import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Text from '../../../../../components/text/Text';

interface BlockTitleProps {
  style?: ViewStyle;
  text: string;
}

const BlockTitle: React.FC<BlockTitleProps> = ({style, text}) => {
  return (
    <View style={{...styles.container, ...style}}>
      <Text style={styles.text} fontFamily="SourceSansPro-SemiBold">
        {text}
      </Text>
    </View>
  );
};

export default BlockTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 12,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  text: {
    textTransform: 'uppercase',
    fontSize: 18,
  },
});
