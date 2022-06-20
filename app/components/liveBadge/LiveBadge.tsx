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
    <View style={[styles.container, {backgroundColor: colors?.textError ?? '#C00'}, props.style]}>
      <TextComponent style={styles.text} fontFamily="SourceSansPro-SemiBold" allowFontScaling={false}>
        {strings?.liveChannelTitle ?? 'Tiesiogiai'}
      </TextComponent>
    </View>
  );
};

export default LiveBadge;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
  },
  text: {
    flexWrap: 'wrap',
    color: 'white',
    letterSpacing: 0.2,
    fontSize: 12.5,
    textTransform: 'uppercase',
  },
});
