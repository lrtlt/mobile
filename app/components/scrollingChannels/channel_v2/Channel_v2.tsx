import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {getIconForChannel, getColorsForChannel} from '../../../util/UI';

import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import TextComponent from '../../text/Text';
import {useTheme} from '../../../Theme';
import {isLiveChannel, LiveChannel, TVChannel} from '../../../api/Types';
import {Box} from '@grapp/stacks';

interface Props {
  data: TVChannel | LiveChannel;
  onPress: (channel: TVChannel | LiveChannel) => void;
}

const ChannelV2: React.FC<React.PropsWithChildren<Props>> = ({data, onPress}) => {
  const {colors, dark} = useTheme();

  const isLive = isLiveChannel(data);

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
    <Box flex={'fluid'}>
      <TouchableDebounce debounceTime={500} onPress={onPressHandler}>
        <View
          style={{
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            backgroundColor: dark ? '#FFFFFF08' : colorsSet.primary + '10',
            borderRadius: 6,
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderColor: isLive ? colors.listSeparator : 'transparent',
            borderWidth: isLive ? StyleSheet.hairlineWidth : undefined,
          }}>
          <View style={{backgroundColor: '#FFFFFF00', paddingHorizontal: 4, borderRadius: 4}}>
            {getIconForChannel(data.channel, {height: 24}, dark ? colors.text : colorsSet.secondary)}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TextComponent style={{...styles.timeText, color: colors.text}}>
              {data.time_start + ' - ' + data.time_end}
            </TextComponent>
            {bottomBarContainer}
          </View>
          <TextComponent style={styles.title} numberOfLines={3}>
            {data.title}
          </TextComponent>
        </View>
      </TouchableDebounce>
    </Box>
  );
};

export default ChannelV2;

const styles = StyleSheet.create({
  liveBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  title: {
    width: '100%',
    fontSize: 14,
  },
  timeText: {
    fontSize: 11.5,
    marginVertical: 6,
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
    height: 4,
    position: 'absolute',
  },
});
