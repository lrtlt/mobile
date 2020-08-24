import React from 'react';
import { View } from 'react-native';
import Styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import ScalableText from '../scalableText/ScalableText';
import Channel from './channel/Channel';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE } from '../../constants';

const scrollingChannels = props => {
  const onChannelPressHandler = channel => {
    props.onChannelPress({ type: CHANNEL_TYPE_DEFAULT, payload: channel });
  };

  const onLiveItemPressHandler = liveItem => {
    props.onChannelPress({ type: CHANNEL_TYPE_LIVE, payload: liveItem });
  };

  if (!props.data) {
    return <View />;
  }

  //props.data.live_items = mockLiveItems;

  const liveItemsContent = props.data.live_items
    ? props.data.live_items.map((liveItem, i) => {
        return (
          <Channel
            data={liveItem}
            key={liveItem.title}
            isLive={true}
            onPress={liveChannel => onLiveItemPressHandler(liveChannel)}
          />
        );
      })
    : null;

  const itemsContent = props.data.items
    ? props.data.items.map((item, i) => {
        return (
          <Channel
            data={item}
            key={`${i}-${item.proc}`}
            onPress={channel => onChannelPressHandler(channel)}
          />
        );
      })
    : null;

  return (
    <View style={Styles.container}>
      <View style={Styles.topHeader}>
        <ScalableText style={Styles.leftText}>{EStyleSheet.value('$tvProgramTitle')}</ScalableText>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={Styles.scrollContent}>
          {liveItemsContent}
          {itemsContent}
        </View>
      </ScrollView>
    </View>
  );
};

const mockLiveItems = [
  {
    channel: 'liveTest',
    channel_id: 15,
    get_streams_url: 'https://www.lrt.lt/servisai/stream_url/live/get_live_url.php?channel=live9',
    href: '/mediateka/tiesiogiai/live9',
    photo: '/img/2020/08/23/707881-534269-{WxH}.jpg',
    photo_id: 707881,
    stream_embed: 'https://www.lrt.lt/mediateka/tiesiogiai/live9?embed',
    title: 'Pirmoji Konstantino Kalinausko konferencija, skirta Baltarusijos ateičiai aptarti',
    w_h: '1.5',
  },
];

export default scrollingChannels;
