import React from 'react';
import { View } from 'react-native';
import Styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import ScalableText from '../scalableText/ScalableText';
import LiveChannel from './liveItem/LiveChannel';
import Channel from './item/Channel';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE } from '../../constants';

const scrollingChannels = props => {
  // const liveItems = [
  //   {
  //     href: '/mediateka/tiesiogiai/live2',
  //     photo: '/img/2019/10/16/531858-893030-{WxH}.jpg',
  //     photo_id: 531858,
  //     title: '„Ramūnas Zilnys kalbina“: grupė „Pikaso“',
  //     get_streams_url:
  //       'https://www.lrt.lt/servisai/stream_url/live/get_live_url.php?channel=LTV1',
  //     w_h: '1.5',
  //   },
  // ];

  // const liveItemsContent = liveItems.map((liveItem, i) => {
  //   return (
  //     <LiveItem
  //       data={liveItem}
  //       key={String(i)}
  //       onPress={liveChannel => onLiveItemPressHandler(liveChannel)}
  //     />
  //   );
  // });

  const onChannelPressHandler = channel => {
    props.onChannelPress({ type: CHANNEL_TYPE_DEFAULT, payload: channel });
  };

  const onLiveItemPressHandler = liveItem => {
    props.onChannelPress({ type: CHANNEL_TYPE_LIVE, payload: liveItem });
  };

  if (!props.data) {
    return <View />;
  }

  const liveItemsContent = props.data.live_items
    ? props.data.live_items.map((liveItem, i) => {
        return (
          <LiveChannel
            data={liveItem}
            key={liveItem.title}
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
        {/* <ScalableText style={Styles.rightText}>Programa</ScalableText> */}
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

export default scrollingChannels;
