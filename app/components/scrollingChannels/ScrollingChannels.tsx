import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import Channel from './channel/Channel';
import {CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE} from '../../constants';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {useSelector} from 'react-redux';
import {selectHomeChannels} from '../../redux/selectors';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {isLiveChannel, LiveChannel, TVChannel} from '../../api/Types';
import MyScrollView from '../MyScrollView/MyScrollView';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';

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

const ScrollingChannels: React.FC<Props> = ({onChannelPress}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const {colors, strings} = useTheme();
  const channelsData = useSelector(selectHomeChannels, checkEqual);

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

  const onProgramPressHandler = useCallback(() => {
    navigation.navigate('Program');
  }, [navigation]);

  if (!channelsData || channelsData.channels.length === 0) {
    return <View />;
  }

  const {channels, liveChannels, tempLiveChannels} = channelsData;

  const channelsContent =
    channels &&
    channels.map((item, i) => {
      return <Channel data={item} key={`${i}-${item.proc}`} onPress={onChannelPressHandler} />;
    });

  const liveChannelsContent =
    liveChannels &&
    liveChannels.map((liveItem) => {
      return <Channel data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
    });

  const tempLiveChannelsContent =
    tempLiveChannels &&
    tempLiveChannels.map((liveItem) => {
      return <Channel data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
    });

  return (
    <View style={{...styles.container, backgroundColor: colors.slugBackground}}>
      <View style={styles.topHeader}>
        <TextComponent style={styles.leftText} fontFamily="SourceSansPro-SemiBold">
          {strings.tvProgramTitle}
        </TextComponent>
        <TouchableDebounce onPress={onProgramPressHandler}>
          <TextComponent style={{...styles.rightText, color: colors.primary}}>
            {strings.tvProgram}
          </TextComponent>
        </TouchableDebounce>
      </View>
      <MyScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {liveChannelsContent}
          {channelsContent}
          {tempLiveChannelsContent}
        </View>
      </MyScrollView>
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
    padding: 8,
  },
  rightText: {
    fontSize: 15,
    textTransform: 'capitalize',
    padding: 8,
    margin: 8,
  },
});
