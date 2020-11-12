import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {
  VideoComponent,
  ProgramItem,
  OpusNowPlaying,
  ScrollingChannels,
  ScreenLoader,
  ScreenError,
} from '../../components';
import {channelGet} from '../../api';
import {useSelector} from 'react-redux';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import {getIconForChannel} from '../../util/UI';

import {CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE, GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {selectTVProgram} from '../../redux/selectors';

const PROGRAM_ITEMS_VISIBLE = 2;

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ChannelScreen = (props) => {
  const {navigation, route} = props;

  const [state, setState] = useState({
    channel: null,
    loadingState: STATE_LOADING,
  });

  const [selectedChannel, setSelectedChannel] = useState(route.params.channelId);

  const {tvProgram} = useSelector(selectTVProgram);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: EStyleSheet.value('$channelScreenTitle'),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'channel',
      channelId: selectedChannel.toString(),
    });

    loadChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  const loadChannel = () => {
    console.log('Loading channel:' + selectedChannel);
    callApi(selectedChannel)
      .then((response) =>
        setState({
          channel: response,
          loadingState: response.channel_info ? STATE_READY : STATE_ERROR,
        }),
      )
      .catch((error) =>
        setState({
          channel: null,
          loadingState: STATE_ERROR,
        }),
      );
  };

  const callApi = async (channelId) => {
    const response = await fetch(channelGet(channelId));
    const result = await response.json();
    console.log('CHANNEL API RESPONSE', result);
    return result;
  };

  const onChannelPressHandler = (channel) => {
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
  };

  const renderChannelComponent = () => {
    const {channel_info} = state.channel;

    const channelIconComponent = getIconForChannel(channel_info.channel, 40);

    const {prog} = state.channel;

    const programComponent = prog
      ? prog.map((item, i) => {
          if (i >= PROGRAM_ITEMS_VISIBLE) {
            return;
          }

          let opusNowPlayingComponent = null;
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
      : null;

    return (
      <View>
        <View style={Styles.playerContainer}>
          <VideoComponent
            key={channel_info.stream_embed}
            mediaId={channel_info.channel_id ? channel_info.channel_id.toString() : null}
            style={Styles.player}
            autoPlay={true}
            backgroundImage={channel_info.player_background_image}
            isLiveStream={true}
            isAudioOnly={channel_info.is_radio === 1}
            title={channel_info.title}
            streamUrl={channel_info.get_streams_url}
            embedUrl={channel_info.stream_embed}
          />
        </View>
        <View style={Styles.programContainer}>
          {channelIconComponent}
          {programComponent}
          <TouchableOpacity onPress={() => navigation.navigate('Program')}>
            <Text style={Styles.fullProgramText}>{EStyleSheet.value('$tvProgramButtonText')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderLoading = () => (
    <View style={Styles.player}>
      <ScreenLoader />
    </View>
  );

  const renderError = () => (
    <View style={Styles.player}>
      <ScreenError text={EStyleSheet.value('$liveChanelError')} />
    </View>
  );

  const {loadingState} = state;

  let content;

  switch (loadingState) {
    case STATE_LOADING: {
      content = renderLoading();
      break;
    }
    case STATE_ERROR: {
      content = renderError();
      break;
    }
    case STATE_READY: {
      content = renderChannelComponent();
      break;
    }
  }

  const tvBar =
    loadingState === STATE_READY || loadingState === STATE_ERROR ? (
      <ScrollingChannels data={tvProgram} onChannelPress={(channel) => onChannelPressHandler(channel)} />
    ) : null;

  return (
    <View style={Styles.screen}>
      <ScrollView style={Styles.scrollContainer}>
        <View style={Styles.container}>
          {content}
          {tvBar}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChannelScreen;
