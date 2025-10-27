import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import ChannelHorizontal from './channel/ChannelHorizontal';
import {TVProgramChannel, TVProgramResponse} from '../../api/Types';

interface Props {
  data?: TVProgramResponse;
  onChannelPress: (channel: TVProgramChannel) => void;
}

const ChannelList: React.FC<React.PropsWithChildren<Props>> = ({data, onChannelPress}) => {
  const onChannelPressHandler = useCallback(
    (channel: TVProgramChannel) => {
      onChannelPress(channel);
    },
    [onChannelPress],
  );

  if (!data) {
    return <View />;
  }

  const {items, live_items} = data.tvprog;

  const channelsContent =
    items &&
    items.map((item, i) => {
      return <ChannelHorizontal data={item} key={`${i}-${item.proc}`} onPress={onChannelPressHandler} />;
    });

  const liveChannelsContent =
    live_items &&
    live_items.map((liveItem) => {
      return <ChannelHorizontal data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
    });

  // const tempLiveChannelsContent =
  //   tempLiveChannels &&
  //   tempLiveChannels.map((liveItem) => {
  //     return <ChannelHorizontal data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
  //   });

  return (
    <View style={{...styles.container}}>
      <View style={styles.scrollContent}>
        {liveChannelsContent}
        {channelsContent}
        {/* {tempLiveChannelsContent} */}
      </View>
    </View>
  );
};

export default ChannelList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    gap: 4,
  },
  leftText: {
    fontSize: 18,
    textTransform: 'uppercase',
    padding: 8,
  },
  rightText: {
    fontSize: 15,
    textTransform: 'capitalize',
    padding: 8,
    margin: 8,
  },
});
