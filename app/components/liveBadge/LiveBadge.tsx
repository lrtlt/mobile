import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';

interface Props {
  style?: ViewStyle;
}

const LiveBadge: React.FC<Props> = (props) => {
  const {colors, strings} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.textError}, props.style]}>
      <Text style={styles.text}> {strings.liveChannelTitle} </Text>
    </View>
  );
};

export default LiveBadge;

const styles = StyleSheet.create({
  container: {
    padding: 3,
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
