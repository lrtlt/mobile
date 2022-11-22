import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollingChannels, ScreenLoader, ScreenError, MyScrollView} from '../../components';
import {fetchChannel} from '../../api';
import {getIconForChannelById, getSmallestDim} from '../../util/UI';

import {ARTICLE_EXPIRE_DURATION, GEMIUS_VIEW_SCRIPT_ID, VIDEO_ASPECT_RATIO} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {ChannelResponse} from '../../api/Types';
import {ChannelDataType} from '../../components/scrollingChannels/ScrollingChannels';
import ChannelComponent from './ChannelComponent';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import useAppStateCallback from '../../hooks/useAppStateCallback';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Channel'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Channel'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

type ScreenState = {
  channel?: ChannelResponse;
  lastFetchTime: number;
  loadingState: typeof STATE_LOADING | typeof STATE_ERROR | typeof STATE_READY;
};

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ChannelScreen: React.FC<Props> = ({navigation, route}) => {
  const [state, setState] = useState<ScreenState>({
    channel: undefined,
    lastFetchTime: 0,
    loadingState: STATE_LOADING,
  });
  const [selectedChannel, setSelectedChannel] = useState(route.params.channelId);

  const {strings} = useTheme();

  const cancellablePromise = useCancellablePromise();

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

  const loadChannel = () => {
    cancellablePromise(fetchChannel(selectedChannel))
      .then((response) =>
        setState({
          channel: response,
          lastFetchTime: Date.now(),
          loadingState: response.channel_info ? STATE_READY : STATE_ERROR,
        }),
      )
      .catch(() =>
        setState({
          channel: undefined,
          lastFetchTime: 0,
          loadingState: STATE_ERROR,
        }),
      );
  };

  useAppStateCallback(
    useCallback(() => {
      if (Date.now() - state.lastFetchTime > ARTICLE_EXPIRE_DURATION) {
        loadChannel();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.lastFetchTime]),
  );

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'channel',
      channelId: selectedChannel.toString(),
    });
    loadChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancellablePromise, selectedChannel]);

  const onChannelPressHandler = useCallback((channel: ChannelDataType) => {
    const {payload} = channel;
    setSelectedChannel(payload.channel_id);
  }, []);

  const {loadingState} = state;

  let content;

  switch (loadingState) {
    case STATE_LOADING: {
      content = (
        <View style={styles.player}>
          <ScreenLoader />
        </View>
      );
      break;
    }
    case STATE_ERROR: {
      content = (
        <View style={styles.player}>
          <ScreenError text={strings.liveChanelError} />
        </View>
      );
      break;
    }
    case STATE_READY: {
      content = <ChannelComponent channelData={state.channel!} />;
      break;
    }
  }

  const tvBar =
    loadingState === STATE_READY || loadingState === STATE_ERROR ? (
      <ScrollingChannels onChannelPress={onChannelPressHandler} />
    ) : undefined;

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <MyScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {content}
          {tvBar}
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
    alignItems: 'center',
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
