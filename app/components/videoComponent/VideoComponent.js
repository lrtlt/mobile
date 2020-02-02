import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import PropTypes from 'prop-types';

import VideoCover from './VideoCover';
import JWPlayerEmbed from './JWPlayerEmbed';
import JWPlayerNative from './JWPlayerNative';
import NativeVideoPlayer from './NativeVideoPlayer';

const initialState = {
  isLoading: false,
  embedUrl: null,
  streamUri: null,
  mediaId: null,
};

const renderLoading = animating => {
  return (
    <View style={Styles.loaderContainer}>
      <ActivityIndicator size="small" animating={animating} color={EStyleSheet.value('$primary')} />
    </View>
  );
};

const callApi = async url => {
  const response = await fetch(url);
  const result = await response.json();
  console.log('VIDEO API RESPONSE', result);
  return result;
};

const VideoComponent = props => {
  const [videoState, setVideoState] = useState(initialState);

  const handlePlayPress = () => {
    setVideoState({ ...initialState, isLoading: true });
    callApi(props.streamUrl).then(response => {
      const newState = { ...videoState };
      newState.isLoading = false;
      newState.embedUrl = response.full_url;

      if (props.isLiveStream) {
        newState.streamUri = response.response.data.content.trim();
      } else {
        const { playlist_item } = response;
        newState.streamUri = playlist_item.file.trim();
        newState.mediaId = playlist_item.mediaid ? playlist_item.mediaid.toString() : null;
      }
      setVideoState(newState);
    });
  };

  useEffect(() => {
    if (props.isLiveStream) {
      handlePlayPress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderJWPlayerNative = (streamUrl, mediaId, autoPlay) => {
    return <JWPlayerNative streamUrl={streamUrl} autoPlay={autoPlay} mediaId={mediaId} />;
  };

  const renderJWPlayerEmbed = url => {
    const formatedUrl = url.endsWith('?embed') ? url : `${url}?embed`;
    return <JWPlayerEmbed embedUrl={formatedUrl} autoPlay={props.autoPlay} />;
  };

  const renderNativePlayer = uri => {
    return <NativeVideoPlayer isLiveStream={props.isLiveStream} streamUri={uri} />;
  };

  const renderCover = () => {
    return (
      <TouchableHighlight onPress={handlePlayPress}>
        <VideoCover {...props} />
      </TouchableHighlight>
    );
  };

  let content;

  const { streamUri, isLoading, mediaId } = videoState;
  if (streamUri) {
    if (Platform.OS == 'android') {
      content = renderJWPlayerNative(streamUri, mediaId, true);
    } else {
      content = renderNativePlayer(streamUri);
    }
  } else if (isLoading === true) {
    content = renderLoading(isLoading);
  } else {
    content = renderCover();
  }

  return <View {...props}>{content}</View>;
};

VideoComponent.propTypes = {
  ...VideoCover.propTypes,
  ...JWPlayerEmbed.propTypes,
  ...NativeVideoPlayer.propTypes,
  streamUrl: PropTypes.string,
};

VideoComponent.defaultProps = {
  autoPlay: true,
};

export default VideoComponent;
