import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';

const LiveBadge: React.FC = () => {
  const {colors, strings} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.textError}]}>
      <Text style={styles.text}> {strings.liveChannelTitle} </Text>
    </View>
  );
};

export default LiveBadge;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 4,
    flexDirection: 'row',
  },
  text: {
    flexWrap: 'wrap',
    color: 'white',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 13,
  },
});
