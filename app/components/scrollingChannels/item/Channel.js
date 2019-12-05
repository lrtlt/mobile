import React from 'react';
import { View, Text } from 'react-native';
import Styles from './styles';
import IC_CAMERA from '../../svg/ic_camera';
import IC_MICROPHONE from '../../svg/ic_microphone';
import { getIconForChannel, getColorsForChannel } from '../../../util/UI';

import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

const channel = props => {
  const data = props.data;
  const proc = Math.max(0, Math.min(Number(data.proc), 100));
  const colorsSet = getColorsForChannel(data.channel);
  const channelIcon = getIconForChannel(data.channel);

  const icon = data.is_radio ? <IC_MICROPHONE size={20} /> : <IC_CAMERA size={20} />;

  const startEndTimeText = data.time_start + ' - ' + data.time_end;

  return (
    <View>
      <TouchableDebounce debounceTime={500} onPress={() => props.onPress(props.data)}>
        <View style={Styles.container}>
          <View style={Styles.content}>
            <View style={Styles.topHeaderContainer}>
              <View style={Styles.channelTimeContainer}>
                {channelIcon}
                <Text style={Styles.timeText}>{startEndTimeText}</Text>
              </View>
              {icon}
            </View>

            <Text style={Styles.title} numberOfLines={2}>
              {data.title}
            </Text>
          </View>
          <View style={Styles.bottomBarContainer}>
            <View
              style={{
                ...Styles.bottomBar,
                backgroundColor: colorsSet.primary,
              }}
            />
            <View
              style={{
                ...Styles.bottomBarOverlay,
                width: proc + '%',
                backgroundColor: colorsSet.secondary,
              }}
            />
          </View>
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default React.memo(channel);
