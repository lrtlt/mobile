import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './styles';
import JWPlayer from 'react-native-jw-media-player';

const JWPlayerNative = ({ streamUri, mediaId, autoPlay, title, description }) => {
  const createPlaylistItem = () => {
    return {
      title: title,
      mediaId: mediaId,
      image:
        'https://yt3.ggpht.com/a/AGF-l78bfgG98j-GH2Yw816bbYmnXho-wUselvJM6A=s288-c-k-c0xffffffff-no-rj-mo',
      desc: description,
      time: 0,
      file: streamUri,
      autostart: autoPlay,
      controls: true,
      repeat: false,
      displayDescription: false,
      displayTitle: false,
    };
  };

  return (
    <View style={Styles.htmlContainer}>
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
          StatusBar.setHidden(true, true);
        }}
        onFullScreenExit={() => {
          StatusBar.setHidden(false, true);
        }}
      />
    </View>
  );
};

JWPlayerNative.propTypes = {
  autoPlay: PropTypes.bool,
  streamUrl: PropTypes.string,
  mediaId: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

JWPlayerNative.defaultProps = {
  autoPlay: true,
};

export default JWPlayerNative;
