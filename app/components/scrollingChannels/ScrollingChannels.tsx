import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE} from '../../constants';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {isLiveChannel, LiveChannel, TVChannel} from '../../api/Types';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {Box, Tiles} from '@grapp/stacks';
import ChannelV2 from './channel_v2/Channel_v2';
import {useArticleStore} from '../../state/article_store';
import {useShallow} from 'zustand/shallow';

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

const ScrollingChannels: React.FC<React.PropsWithChildren<Props>> = ({onChannelPress}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const {colors, strings} = useTheme();
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
      return <ChannelV2 data={item} key={`${i}-${item.proc}`} onPress={onChannelPressHandler} />;
    });

  const liveChannelsContent =
    liveChannels &&
    liveChannels.map((liveItem) => {
      return <ChannelV2 data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
    });

  const tempLiveChannelsContent =
    tempLiveChannels &&
    tempLiveChannels.map((liveItem) => {
      return <ChannelV2 data={liveItem} key={liveItem.title} onPress={onChannelPressHandler} />;
    });

  return (
    <View style={{...styles.container}}>
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
      <View style={styles.scrollContent}>
        <Box flex={'fluid'}>
          <Tiles space={2} columns={2} margin={1}>
            {liveChannelsContent}
            {channelsContent}
            {tempLiveChannelsContent}
          </Tiles>
        </Box>
      </View>
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
    padding: 8,
  },
  rightText: {
    fontSize: 15,
    textTransform: 'capitalize',
    padding: 8,
    margin: 8,
  },
});
