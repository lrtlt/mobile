import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import VideoCover from './VideoCover';
import JWPlayerNative from './JWPlayerNative';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';

const initialState = {
  isLoading: false,
  embedUrl: null,
  streamUri: null,
  mediaId: null,
  title: null,
  backgroundImage: null,
  description: null,
};

const callApi = async (url) => {
  const response = await fetch(url);
  const result = await response.json();
  console.log('VIDEO API RESPONSE', result);
  return result;
};

const VideoComponent = (props) => {
  const {colors} = useTheme();

  const [videoState, setVideoState] = useState(initialState);

  const handlePlayPress = () => {
    setVideoState({...initialState, isLoading: true});
    callApi(props.streamUrl).then((response) => {
      const newState = {...videoState};
      newState.isLoading = false;
      newState.embedUrl = response.full_url;

      if (props.isLiveStream) {
        newState.mediaId = props.mediaId;
        newState.streamUri = response.response.data.content.trim();
        newState.title = props.title;
        newState.backgroundImage = props.backgroundImage;
        Gemius.setProgramData(props.mediaId, newState.title, -1, !props.isAudioOnly);
      } else {
        const {playlist_item} = response;
        newState.streamUri = playlist_item.file.trim();
        newState.mediaId = playlist_item.mediaid ? playlist_item.mediaid.toString() : null;
        newState.title = response.title;
        Gemius.setProgramData(newState.mediaId, newState.title, 0, !props.isAudioOnly);
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

  const renderJWPlayerNative = (videoProps) => {
    return <JWPlayerNative {...videoProps} autoPlay={props.autoPlay} />;
  };

  const renderCover = () => {
    return (
      <TouchableHighlight onPress={handlePlayPress}>
        <VideoCover {...props} />
      </TouchableHighlight>
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" animating={isLoading} color={colors.primary} />
      </View>
    );
  };

  let content;

  const {streamUri, isLoading} = videoState;
  if (streamUri) {
    content = renderJWPlayerNative(videoState);
  } else if (isLoading === true) {
    content = renderLoading(isLoading);
  } else {
    content = renderCover();
  }

  return <View {...props}>{content}</View>;
};

VideoComponent.propTypes = {
  ...VideoCover.propTypes,
  ...JWPlayerNative.propTypes,
  mediaId: PropTypes.string,
  streamUrl: PropTypes.string,
  title: PropTypes.string,
  isLiveStream: PropTypes.bool,
  isAudioOnly: PropTypes.bool,
  autoPlay: PropTypes.bool,
};

VideoComponent.defaultProps = {
  autoPlay: true,
  isLiveStream: false,
  isAudioOnly: false,
};

export default VideoComponent;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
