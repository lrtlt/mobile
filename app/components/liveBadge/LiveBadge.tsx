import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
}

const LiveBadge: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {strings} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: 'black' ?? '#C00'}, props.style]}>
      <TextComponent style={styles.text} fontFamily="SourceSansPro-Regular" allowFontScaling={false}>
        {strings?.liveChannelTitle ?? 'Gyvai'}
      </TextComponent>
    </View>
  );
};

export default LiveBadge;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 1,
  },
  text: {
    flexWrap: 'wrap',
    color: 'white',
    letterSpacing: 1.5,
    fontSize: 12.5,
    textTransform: 'uppercase',
  },
});
