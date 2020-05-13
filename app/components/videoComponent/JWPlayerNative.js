import React, { useState, useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './styles';
import JWPlayer from 'react-native-jw-media-player';

import Gemius from 'react-native-gemius-plugin';

const JWPlayerNative = ({ streamUri, mediaId, autoPlay, title, description }) => {

  let playerRef = null;
  let isSeeking = false;

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

  const sendPlay = () => {
    console.log('JWPlayer event: play')
    playerRef.position().then(pos => {
      if(isSeeking === true){
        isSeeking = false;
        console.log('JWPlayer event: seek ' + pos)
        Gemius.sendSeek(mediaId, pos ? pos : 0);
      }
      
      Gemius.sendPlay(mediaId, pos ? pos : 0);
    });
  };

  const sendPause = () => {
    console.log('JWPlayer event: pause')
    playerRef.position().then(pos => {
      Gemius.sendPause(mediaId, pos ? pos : 0);
    });
  };

  const sendClose = () => {
    console.log('JWPlayer event: close')
    playerRef.position().then(pos => {
      playerRef = null;
      Gemius.sendClose(mediaId, pos ? pos : 0);
    });
  };

  const sendBuffer = () => {
    console.log('JWPlayer event: buffering')
    playerRef.position().then(pos => {
      Gemius.sendBuffer(mediaId, pos ? pos : 0);
    });
  }

  const sendComplete = () => {
    console.log('JWPlayer event: complete')
    playerRef.position().then(pos => {
      Gemius.sendComplete(mediaId, pos ? pos : 0);
    });
  }

  const sendSeek = position => {
    console.log('JWPlayer event: seek ' + position)
    Gemius.sendSeek(mediaId, position);
  }

  //TODO: replace with sendSeek after JW player callback fix
  const sendSeekIOS = () => {
    isSeeking = true;
  }

  return (
    <View style={Styles.htmlContainer}>
      <JWPlayer
        ref={ ref => {
          if(playerRef === null || ref !== null){
            playerRef = ref;
          }
        }}
        style={Styles.embedPlayer}
        playlistItem={createPlaylistItem()}
        nativeFullScreen={true}
        nextUpDisplay={true}
        //landscapeOnFullScreen={true}
        //exitFullScreenOnPortrait={true}
        //fullScreenOnLandscape={true}
        //landscapeOnFullScreen={true}
        //onBeforePlay={() => console.log('onBeforePlay')}
        //onBeforeComplete={() => console.log('onBeforeComplete')}
        onPlay={() => sendPlay()}
        onPause={() => sendPause()}
        onSeeked={e => { 
          if(Platform.OS === 'android'){
            sendSeek(e.nativeEvent.position);
          }
        }}
        onSeek={e => { 
          if(Platform.OS === 'ios'){
            sendSeekIOS();
          }
        }}
        onBuffer={() => sendBuffer()}
        onComplete={() => sendComplete()}
        //onPlaylistItem={event => console.log('onPlaylistItem', event)}
        //onSetupPlayerError={event => this.onPlayerError(event)}
        //onPlayerError={event => this.onPlayerError(event)}
        //onTime={e => console.log('onTime', e.nativeEvent)}
        // onFullScreen={() => {
        //   StatusBar.setHidden(true, true);
        // }}
        // onFullScreenExit={() => {
        //   StatusBar.setHidden(false, true);
        // }}
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
