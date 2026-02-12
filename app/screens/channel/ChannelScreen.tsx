import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollingChannels, ScreenLoader, ScreenError, MyScrollView} from '../../components';
import {getIconForChannelById, getSmallestDim} from '../../util/UI';

import {VIDEO_ASPECT_RATIO} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import ChannelComponent from './ChannelComponent';
import useChannelAnalytics from './useChannelAnalytics';
import Config from 'react-native-config';
import {TVProgramChannel} from '../../api/Types';
import {useChannelStreamInfo} from '../../api/hooks/useChannel';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Channel'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Channel'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const ChannelScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const [selectedChannel, setSelectedChannel] = useState(route.params.channelId);

  useEffect(() => {
    setSelectedChannel(route.params.channelId);
  }, [route.params.channelId]);

  const {data, isLoading, error} = useChannelStreamInfo(selectedChannel);
  const {channelData, streamData, audioStreamData} = data || {};

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => {
        return (
          <View style={styles.logoContainer}>{getIconForChannelById(selectedChannel, {height: 30})}</View>
        );
      },
    });
  }, [navigation, selectedChannel, strings.channelScreenTitle]);

  useChannelAnalytics({channel_response: channelData});

  useEffect(() => {
    Gemius.sendPageViewedEvent(Config.GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'channel',
      channelId: selectedChannel.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  const onChannelPressHandler = useCallback((channel: TVProgramChannel) => {
    setSelectedChannel(channel.channel_id);
  }, []);

  let content;

  switch (true) {
    case isLoading: {
      content = (
        <View style={styles.player}>
          <ScreenLoader />
        </View>
      );
      break;
    }
    case !!error: {
      content = (
        <View style={styles.player}>
          <ScreenError text={strings.liveChanelError} />
        </View>
      );
      break;
    }
    case !!data && !!streamData && !!channelData && !!channelData.channel_info: {
      content = (
        <ChannelComponent
          channelData={channelData!}
          streamData={streamData!}
          audioStreamData={audioStreamData}
        />
      );
      break;
    }
  }

  const shouldRenderTVBar = !!data || !!error;

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      <MyScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View collapsable={false}>{content}</View>
          <View collapsable={false}>
            {shouldRenderTVBar && <ScrollingChannels onChannelPress={onChannelPressHandler} />}
          </View>
        </View>
      </MyScrollView>
    </SafeAreaView>
  );
};

export default ChannelScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContainer: {
    minHeight: '100%',
  },
  container: {
    flex: 1,
    marginBottom: 12,
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
  logoContainer: {
    paddingStart: 12,
    paddingEnd: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
