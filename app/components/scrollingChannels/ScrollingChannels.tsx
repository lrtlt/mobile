import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Channel from './channel/Channel';
import {CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE} from '../../constants';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {useSelector} from 'react-redux';
import {selectHomeChannels} from '../../redux/selectors';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {LiveChannel, TVChannel} from '../../api/Types';

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

const ScrollingChannels: React.FC<Props> = (props) => {
  const {colors, strings} = useTheme();
  const channels = useSelector(selectHomeChannels, checkEqual);

  const onChannelPressHandler = useCallback(
    (channel: TVChannel) => {
      props.onChannelPress({type: CHANNEL_TYPE_DEFAULT, payload: channel});
    },
    [props.onChannelPress],
  );

  const onLiveItemPressHandler = useCallback(
    (liveItem: LiveChannel) => {
      props.onChannelPress({type: CHANNEL_TYPE_LIVE, payload: liveItem});
    },
    [props.onChannelPress],
  );

  if (!channels || channels.items.length === 0) {
    return <View />;
  }

  const {items, live_items} = channels;
  //live_items = mockLiveChannel;

  const liveItemsContent =
    live_items &&
    live_items.map((liveItem) => {
      return <Channel data={liveItem} key={liveItem.title} isLive={true} onPress={onLiveItemPressHandler} />;
    });

  const itemsContent =
    items &&
    items.map((item, i) => {
      return <Channel data={item} key={`${i}-${item.proc}`} onPress={onChannelPressHandler} />;
    });

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
