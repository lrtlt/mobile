import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollingChannels, ScreenLoader, ScreenError, MyScrollView} from '../../components';
import {getIconForChannelById, getSmallestDim} from '../../util/UI';

import {GEMIUS_VIEW_SCRIPT_ID, VIDEO_ASPECT_RATIO} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {ChannelDataType} from '../../components/scrollingChannels/ScrollingChannels';
import ChannelComponent from './ChannelComponent';
import useAppStateCallback from '../../hooks/useAppStateCallback';
import useChannelAnalytics from './useChannelAnalytics';
import {useChannel} from './context/useChannel';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Channel'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Channel'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export const PROGRAM_RELOAD_TIME = 1000 * 60 * 2; //2 minutes

const ChannelScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const [selectedChannel, setSelectedChannel] = useState(route.params.channelId);

  useEffect(() => {
    setSelectedChannel(route.params.channelId);
  }, [route.params.channelId]);

  const {channelData, streamData, audioStreamData, lastFetchTime, loadingState, loadChannel, reloadProgram} =
    useChannel();

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => {
        return (
          <View style={styles.logoContainer}>{getIconForChannelById(selectedChannel, {height: 26})}</View>
        );
      },
    });
  }, [navigation, selectedChannel, strings.channelScreenTitle]);

  useChannelAnalytics({channel_response: channelData});

  useAppStateCallback(
    useCallback(() => {
      if (Date.now() - lastFetchTime > PROGRAM_RELOAD_TIME) {
        reloadProgram();
      }
    }, [lastFetchTime]),
  );

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'channel',
      channelId: selectedChannel.toString(),
    });
    loadChannel(selectedChannel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  const onChannelPressHandler = useCallback((channel: ChannelDataType) => {
    const {payload} = channel;
    setSelectedChannel(payload.channel_id);
  }, []);

  let content;

  switch (loadingState) {
    case 'loading': {
      content = (
        <View style={styles.player}>
          <ScreenLoader />
        </View>
      );
      break;
    }
    case 'error': {
      content = (
        <View style={styles.player}>
          <ScreenError text={strings.liveChanelError} />
        </View>
      );
      break;
    }
    case 'ready': {
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

  const shouldRenderTVBar = loadingState === 'ready' || loadingState === 'error';

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <MyScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {content}
          {shouldRenderTVBar && <ScrollingChannels onChannelPress={onChannelPressHandler} />}
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
