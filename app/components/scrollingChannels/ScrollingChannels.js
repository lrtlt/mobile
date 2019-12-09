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
