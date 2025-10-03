import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE} from '../../constants';
import {isLiveChannel, LiveChannel, TVChannel} from '../../api/Types';
import {useArticleStore} from '../../state/article_store';
import {useShallow} from 'zustand/shallow';
import ChannelHorizontal from './channel/ChannelHorizontal';

type LiveChannelData = {
  type: typeof CHANNEL_TYPE_LIVE;
  payload: LiveChannel;
};

type DefaultChannelData = {
  type: typeof CHANNEL_TYPE_DEFAULT;
  payload: TVChannel;
};

export type ChannelDataType = DefaultChannelData | LiveChannelData;

interface Props {
  onChannelPress: (channel: ChannelDataType) => void;
}

const ChannelList: React.FC<React.PropsWithChildren<Props>> = ({onChannelPress}) => {
  const channelsData = useArticleStore(useShallow((state) => state.channels));

  const onChannelPressHandler = useCallback(
    (channel: TVChannel | LiveChannel) => {
      if (isLiveChannel(channel)) {
        onChannelPress({type: CHANNEL_TYPE_LIVE, payload: channel});
      } else {
        onChannelPress({type: CHANNEL_TYPE_DEFAULT, payload: channel});
      }
    },
    [onChannelPress],
  );

  if (!channelsData || channelsData.channels.length === 0) {
    return <View />;
  }

  const {channels, liveChannels, tempLiveChannels} = channelsData;

  const channelsContent =
    channels &&
    channels.map((item, i) => {
      return <ChannelHorizontal data={item} key={`${i}-${item.proc}`} onPress={onChannelPressHandler} />;
    });

  const liveChannelsContent =
    liveChannels &&
    liveChannels.map((liveItem) => {
      return <ChannelHorizontal data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
    });

  const tempLiveChannelsContent =
    tempLiveChannels &&
    tempLiveChannels.map((liveItem) => {
      return <ChannelHorizontal data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
    });

  return (
    <View style={{...styles.container}}>
      <View style={styles.scrollContent}>
        {liveChannelsContent}
        {channelsContent}
        {tempLiveChannelsContent}
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
