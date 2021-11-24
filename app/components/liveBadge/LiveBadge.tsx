import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
}

const LiveBadge: React.FC<Props> = (props) => {
  const {colors, strings} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.textError}, props.style]}>
      <TextComponent style={styles.text} fontFamily="SourceSansPro-SemiBold">
        {' '}
        {strings.liveChannelTitle}{' '}
      </TextComponent>
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
    fontSize: 13,
  },
});
