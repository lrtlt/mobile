import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {getColorsForChannel} from '../../../util/UI';

import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import TextComponent from '../../text/Text';
import {useTheme} from '../../../Theme';
import {LiveChannel, TVChannel} from '../../../api/Types';
import {Text} from '../..';

interface Props {
  data: TVChannel | LiveChannel;
  onPress: (channel: TVChannel | LiveChannel) => void;
}

const ChannelHorizontal: React.FC<React.PropsWithChildren<Props>> = ({data, onPress}) => {
  const {colors} = useTheme();

  const colorsSet = getColorsForChannel(data.channel, {
    primary: colors.background,
    secondary: colors.primary,
  });

  const bottomBarContainer = (
    <View style={styles.bottomBarContainer}>
      <View
        style={{
          ...styles.bottomBar,
          backgroundColor: colorsSet.secondary,
        }}
      />
      <View
        style={{
          ...styles.bottomBarOverlay,
          width: `${Math.max(0, Math.min(Number(data.proc), 100))}%`,
          backgroundColor: colorsSet.secondary,
        }}
      />
    </View>
  );

  const onPressHandler = useCallback(() => {
    onPress(data);
  }, [data, onPress]);

  return (
    <TouchableDebounce
      debounceTime={500}
      onPress={onPressHandler}
      accessibilityLabel={`${data.channel_title ?? ''} ${data.title}`}>
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingVertical: 8,
          gap: 6,
        }}>
        <View>
          <Text style={{...styles.channelTitleText, color: colorsSet.secondary}}>{data.channel_title}</Text>
        </View>
        <TextComponent style={styles.title} numberOfLines={3}>
          {data.title}
        </TextComponent>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <TextComponent style={{...styles.timeText, color: colors.text}} importantForAccessibility="no">
            {data.time_start + ' - ' + data.time_end}
          </TextComponent>
          {bottomBarContainer}
        </View>
      </View>
    </TouchableDebounce>
  );
};

export default ChannelHorizontal;

const styles = StyleSheet.create({
  liveBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  channelTitleText: {
    textTransform: 'uppercase',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  title: {
    width: '100%',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  timeText: {
    fontSize: 11.5,
    letterSpacing: 0.4,
  },
  bottomBarContainer: {
    flex: 1,
    height: 8,
    justifyContent: 'center',
  },
  bottomBar: {
    width: '100%',
    height: 1,
    position: 'absolute',
  },
  bottomBarOverlay: {
    height: 3.5,
    position: 'absolute',
  },
});
