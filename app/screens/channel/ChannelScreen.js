import React from 'react';
import {View, Text, Animated, Platform} from 'react-native';
import {withCollapsible, setSafeBounceHeight} from 'react-navigation-collapsible';
import {
  VideoComponent,
  ProgramItem,
  OpusNowPlaying,
  ScrollingChannels,
  ScreenLoader,
  ScreenError,
} from '../../components';
import {channelGet} from '../../api';
import {connect} from 'react-redux';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import {getIconForChannel} from '../../util/UI';

import {CHANNEL_TYPE_DEFAULT, CHANNEL_TYPE_LIVE, GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {SafeAreaView} from 'react-navigation';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const PROGRAM_ITEMS_VISIBLE = 2;

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const initialState = {
  channel: null,
  state: STATE_LOADING,
};

class ChannelScreen extends React.Component {
  static navigationOptions = (navigationProps) => {
    return {
      title: EStyleSheet.value('$channelScreenTitle'),
    };
  };

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    setSafeBounceHeight(Platform.OS === 'ios' ? 100 : 0);

    const {channelId} = this.props.navigation.state.params;
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'channel',
      channelId: channelId.toString(),
    });

    this.loadChannel(channelId);
  }

  loadChannel = (id) => {
    console.log('Loading channel:' + id);
    this.callApi(id)
      .then((response) =>
        this.setState({
          ...this.state,
          channel: response,
          state: response.channel_info !== null ? STATE_READY : STATE_ERROR,
        }),
      )
      .catch((error) => this.setState({...this.state, channel: null, state: STATE_ERROR}));
  };

  handleTvProgramPress = () => {
    this.props.navigation.navigate('program');
  };

  isChannelLoaded = () => {
    return this.state.channel !== null;
  };

  callApi = async (channelId) => {
    const response = await fetch(channelGet(channelId));
    const result = await response.json();
    console.log('CHANNEL API RESPONSE', result);
    return result;
  };

  onChannelPressHandler = (channel) => {
    const {type, payload} = channel;
    switch (type) {
      case CHANNEL_TYPE_DEFAULT: {
        const channelId = payload.channel_id;
        this.loadChannel(channelId);
        break;
      }
      case CHANNEL_TYPE_LIVE: {
        const channelId = payload.channel_id;
        this.loadChannel(channelId);
        break;
      }
      default: {
        console.warn('Unkown channel type: ' + channel);
      }
    }
  };

  renderLoading = (props) => (
    <View style={Styles.player}>
      <ScreenLoader />
    </View>
  );

  renderError = (props) => (
    <View style={Styles.player}>
      <ScreenError text={EStyleSheet.value('$liveChanelError')} />
    </View>
  );

  renderChannelComponent = (props) => {
    const {channel_info} = this.state.channel;

    const channelIconComponent = getIconForChannel(channel_info.channel, 40);

    const {prog} = this.state.channel;

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
          <TouchableOpacity onPress={() => this.handleTvProgramPress()}>
            <Text style={Styles.fullProgramText}>{EStyleSheet.value('$tvProgramButtonText')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {state} = this.state;

    let content;
    switch (state) {
      case STATE_LOADING: {
        content = this.renderLoading();
        break;
      }
      case STATE_ERROR: {
        content = this.renderError();
        break;
      }
      case STATE_READY: {
        content = this.renderChannelComponent();
        break;
      }
    }

    const tvBar =
      state === STATE_READY || state === STATE_ERROR ? (
        <ScrollingChannels
          data={this.props.tvProgram}
          onChannelPress={(channel) => this.onChannelPressHandler(channel)}
        />
      ) : null;

    const {paddingHeight, animatedY, onScroll} = this.props.collapsible;

    return (
      <SafeAreaView style={Styles.root} forceInset={{horizontal: 'always'}}>
        <View style={Styles.screen}>
          <AnimatedScrollView
            style={Styles.scrollContainer}
            contentContainerStyle={{paddingTop: paddingHeight}}
            scrollIndicatorInsets={{top: paddingHeight}}
            _mustAddThis={animatedY}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            <View style={Styles.container}>
              {content}
              {tvBar}
            </View>
          </AnimatedScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tvProgram: state.articles.tvprog,
  };
};

export default connect(mapStateToProps)(
  withCollapsible(ChannelScreen, {
    iOSCollapsedColor: 'transparent',
  }),
);
