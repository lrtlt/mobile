import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  VideoComponent,
  ProgramItem,
  OpusNowPlaying,
  ScrollingChannels,
  ScreenLoader,
  ScreenError,
  Text,
} from '../../components';
import {fetchChannel} from '../../api';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {getIconForChannel, getSmallestDim} from '../../util/UI';

import {
  CHANNEL_TYPE_DEFAULT,
  CHANNEL_TYPE_LIVE,
  GEMIUS_VIEW_SCRIPT_ID,
  VIDEO_ASPECT_RATIO,
} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp, useCardAnimation} from '@react-navigation/stack';
import {ChannelResponse} from '../../api/Types';
import {ChannelDataType} from '../../components/scrollingChannels/ScrollingChannels';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Channel'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Channel'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

type ScreenState = {
  channel?: ChannelResponse;
  loadingState: typeof STATE_LOADING | typeof STATE_ERROR | typeof STATE_READY;
};

const PROGRAM_ITEMS_VISIBLE = 2;

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ChannelScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors, strings} = useTheme();

  const [state, setState] = useState<ScreenState>({
    channel: undefined,
    loadingState: STATE_LOADING,
  });

  const [selectedChannel, setSelectedChannel] = useState(route.params.channelId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.channelScreenTitle,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'channel',
      channelId: selectedChannel.toString(),
    });

    const loadChannel = () => {
      fetchChannel(selectedChannel)
        .then((response) =>
          setState({
            channel: response,
            loadingState: response.channel_info ? STATE_READY : STATE_ERROR,
          }),
        )
        .catch(() =>
          setState({
            channel: undefined,
            loadingState: STATE_ERROR,
          }),
        );
    };

    loadChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  const onChannelPressHandler = useCallback((channel: ChannelDataType) => {
    const {type, payload} = channel;
    switch (type) {
      case CHANNEL_TYPE_DEFAULT: {
        const channelId = payload.channel_id;
        setSelectedChannel(channelId);
        break;
      }
      case CHANNEL_TYPE_LIVE: {
        const channelId = payload.channel_id;
        setSelectedChannel(channelId);
        break;
      }
      default: {
        console.warn('Unkown channel type: ' + channel);
      }
    }
  }, []);

  const onProgramPressHandler = useCallback(() => {
    navigation.navigate('Program');
  }, []);

  const renderChannelComponent = () => {
    const {channel_info} = state.channel!;

    const channelIconComponent = getIconForChannel(channel_info.channel, 40);

    const {prog} = state.channel!;

    const programComponent = prog
      ? prog.map((item, i) => {
          if (i >= PROGRAM_ITEMS_VISIBLE) {
            return;
          }

          let opusNowPlayingComponent;
          if (i === 0 && channel_info.channel.toLowerCase().includes('opus')) {
            opusNowPlayingComponent = <OpusNowPlaying />;
          }

          const marginTop = i > 0 ? 8 : 0;
          return (
            <View key={item.time_start + item.title}>
              <ProgramItem
                style={{marginTop}}
                title={item.title}
                startTime={item.time_start}
                percent={item.proc}
              />
              {opusNowPlayingComponent}
            </View>
          );
        })
      : undefined;

    return (
      <View>
        <View style={styles.playerContainer}>
          <VideoComponent
            key={channel_info.stream_embed}
            style={styles.player}
            mediaId={channel_info.channel_id ? channel_info.channel_id.toString() : undefined}
            autoPlay={true}
            backgroundImage={channel_info.player_background_image}
            isLiveStream={true}
            isAudioOnly={channel_info.is_radio === 1}
            title={channel_info.title}
            streamUrl={channel_info.get_streams_url}
            embedUrl={channel_info.stream_embed}
          />
        </View>
        <View style={{...styles.programContainer, backgroundColor: colors.greyBackground}}>
          <View style={styles.channelIconHolder}>{channelIconComponent}</View>
          {programComponent}
          <TouchableOpacity onPress={onProgramPressHandler}>
            <Text style={{...styles.fullProgramText, backgroundColor: colors.background}}>
              {strings.tvProgramButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
      content = renderChannelComponent();
      break;
    }
  }

  const tvBar =
    loadingState === STATE_READY || loadingState === STATE_ERROR ? (
      <ScrollingChannels onChannelPress={onChannelPressHandler} />
    ) : undefined;

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {content}
          {tvBar}
        </View>
      </ScrollView>
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
    padding: 12,
  },
  playerContainer: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  programContainer: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    padding: 8,
    paddingTop: 8,
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
  fullProgramText: {
    width: '100%',
    minWidth: '100%',
    textAlign: 'center',
    padding: 16,
    marginTop: 8,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
  },
  photo: {
    width: '100%',
  },
  channelIconHolder: {
    marginVertical: 8,
  },
});
