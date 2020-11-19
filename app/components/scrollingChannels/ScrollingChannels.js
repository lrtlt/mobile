import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Channel from './channel/Channel';
import {CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE} from '../../constants';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

const ScrollingChannels = (props) => {
  const {colors, strings} = useTheme();

  const onChannelPressHandler = (channel) => {
    props.onChannelPress({type: CHANNEL_TYPE_DEFAULT, payload: channel});
  };

  const onLiveItemPressHandler = (liveItem) => {
    props.onChannelPress({type: CHANNEL_TYPE_LIVE, payload: liveItem});
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
            onPress={(liveChannel) => onLiveItemPressHandler(liveChannel)}
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
            onPress={(channel) => onChannelPressHandler(channel)}
          />
        );
      })
    : null;

  return (
    <View style={{...styles.container, backgroundColor: colors.slugBackground}}>
      <View style={styles.topHeader}>
        <TextComponent style={styles.leftText}>{strings.tvProgramTitle}</TextComponent>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {liveItemsContent}
          {itemsContent}
        </View>
      </ScrollView>
    </View>
  );
};

const _mockLiveItems = [
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

export default ScrollingChannels;

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 2,
    padding: 4,
    paddingBottom: 8,
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  scrollContent: {
    flex: 1,
    flexDirection: 'row',
  },

  leftText: {
    fontSize: 18,
    textTransform: 'uppercase',
    margin: 8,
    fontFamily: 'SourceSansPro-SemiBold',
  },
});
