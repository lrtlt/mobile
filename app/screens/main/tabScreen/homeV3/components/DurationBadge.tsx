import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../../components';

interface Props {
  duration: string;
}

/** "32:34" media length in the top left corner of an image. */
const DurationBadge: React.FC<Props> = ({duration}) => (
  <View style={styles.container} importantForAccessibility="no-hide-descendants">
    <Text style={styles.text} fontFamily="SourceSansPro-SemiBold" scalingEnabled={false}>
      {duration}
    </Text>
  </View>
);

export default DurationBadge;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    left: 8,
    height: 26,
    paddingHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 3, 13, 0.4)',
  },
  text: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});
