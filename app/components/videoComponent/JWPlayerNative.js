import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './styles';
import LRTStatusBar from '../statusBar/LRTStatusBar';

import JWPlayer from 'react-native-jw-media-player';

const JWPlayerNative = ({ streamUrl, autoPlay }) => {
  const [isFullScreen, setFullScreen] = useState(false);

  const createPlaylistItem = () => {
    return {
      //title: 'Title',
      //mediaId: -1,
      //image: 'https://www.lrt.lt/images/logo/logo-lrt.svg?v=254',
      //desc: 'Description',
      time: 0,
      file: streamUrl,
      autostart: autoPlay,
      controls: true,
      repeat: false,
      displayDescription: false,
      displayTitle: false,
    };
  };

  return (
    <View style={Styles.htmlContainer}>
      <LRTStatusBar hidden={isFullScreen} />
      <JWPlayer
        style={Styles.embedPlayer}
        playlistItem={createPlaylistItem()}
        nativeFullScreen={true}
        nextUpDisplay={true}
        // fullScreenOnLandscape={true}
        // landscapeOnFullScreen={true}
        // onBeforePlay={() => this.onBeforePlay()}
        // onPlay={() => this.onPlay()}
        // onPause={() => this.onPause()}
        // onIdle={() => console.log('onIdle')}
        // onPlaylistItem={event => this.onPlaylistItem(event)}
        // onSetupPlayerError={event => this.onPlayerError(event)}
        // onPlayerError={event => this.onPlayerError(event)}
        // onBuffer={() => this.onBuffer()}
        // onTime={event => this.onTime(event)}
        onFullScreen={() => {
          setFullScreen(true);
        }}
        onFullScreenExit={() => {
          setFullScreen(false);
        }}
      />
    </View>
  );
};

JWPlayerNative.propTypes = {
  autoPlay: PropTypes.bool,
  streamUrl: PropTypes.string,
};

JWPlayerNative.defaultProps = {
  autoPlay: true,
};

export default JWPlayerNative;
