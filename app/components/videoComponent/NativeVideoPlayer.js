import React from 'react';
import { View, Text } from 'react-native';
import VideoPlayer from '../videoPlayer/VideoPlayer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import Styles from './styles';

const NativeVideoPlayer = ({ autoPlay, streamUri, isLiveStream }) => {
  const renderError = () => {
    return (
      <View style={Styles.loaderContainer}>
        <Icon name="error" color="white" size={24} />
        <Text style={Styles.errorText}>{EStyleSheet.value('$videoNotAvailable')}</Text>
      </View>
    );
  };

  if (streamUri) {
    return (
      <VideoPlayer
        paused={autoPlay == false}
        disableFullscreen={false}
        disableBack={true}
        fullscreen={false}
        isLiveStream={isLiveStream}
        fullscreenAutorotate={true}
        source={{ uri: streamUri }}
      />
    );
  } else {
    return renderError();
  }
};

NativeVideoPlayer.propTypes = {
  streamUri: PropTypes.string,
  isLiveStream: PropTypes.bool,
  autoPlay: PropTypes.bool,
};

NativeVideoPlayer.defaultProps = {
  autoPlay: false,
};

export default React.memo(NativeVideoPlayer);
