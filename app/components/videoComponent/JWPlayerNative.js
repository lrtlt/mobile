import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './styles';
import JWPlayer from 'react-native-jw-media-player';

const JWPlayerNative = ({ streamUri, mediaId, autoPlay, title, description }) => {
  useEffect(() => {
    return () => {
      //Cleanup
      sendClose();
    };
  }, []);

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

  let isPlaying = false;

  const sendPlay = () => {
    if (!isPlaying) {
      isPlaying = !isPlaying;
      console.log('Sending play');
    }
  };

  const sendPause = () => {
    if (isPlaying) {
      isPlaying = !isPlaying;
      console.log('Sending pause');
    }
  };

  const sendClose = () => {
    console.log('Sending close');
  };

  return (
    <View style={Styles.htmlContainer}>
      <JWPlayer
        style={Styles.embedPlayer}
        playlistItem={createPlaylistItem()}
        nativeFullScreen={true}
        nextUpDisplay={true}
        //landscapeOnFullScreen={true}
        exitFullScreenOnPortrait={true}
        fullScreenOnLandscape={true}
        // fullScreenOnLandscape={true}
        // landscapeOnFullScreen={true}
        //onBeforePlay={() => console.log('onBeforePlay')}
        onPlay={() => sendPlay()}
        onPause={() => sendPause()}
        //onIdle={() => console.log('onIdle')}
        //onPlaylistItem={event => console.log('onPlaylistItem', event)}
        //onSetupPlayerError={event => this.onPlayerError(event)}
        // onPlayerError={event => this.onPlayerError(event)}
        //onBuffer={() => console.log('onBuffer')}
        //onTime={event => console.log('onTime', event)}
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
