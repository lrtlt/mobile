import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './styles';
import JWPlayer from 'react-native-jw-media-player';

import Gemius from 'react-native-gemius-plugin';

const DEFAULT_BACKGROUND_IMAGE =
  'https://yt3.ggpht.com/a/AGF-l78bfgG98j-GH2Yw816bbYmnXho-wUselvJM6A=s288-c-k-c0xffffffff-no-rj-mo';

const JWPlayerNative = ({ streamUri, mediaId, autoPlay, title, backgroundImage, description }) => {
  let playerRef = null;

  const showStatusBar = () => {
    StatusBar.setHidden(false, true);
    StatusBar.setBarStyle('dark-content', true);
  };

  useEffect(() => {
    return () => {
      //Cleanup
      showStatusBar();
      sendClose();
    };
  }, []);

  const image = backgroundImage ? backgroundImage : DEFAULT_BACKGROUND_IMAGE;

  const createPlaylistItem = () => {
    return {
      title: title,
      mediaId: mediaId,
      image: image,
      desc: description,
      time: 0,
      file: streamUri,
      autostart: autoPlay,
      controls: true,
      repeat: false,
      displayDescription: false,
      displayTitle: false,
      backgroundAudioEnabled: true,
    };
  };

  const sendPlay = () => {
    console.log('JWPlayer event: play');
    playerRef.position().then(pos => {
      Gemius.sendPlay(mediaId, pos ? pos : 0);
    });
  };

  const sendPause = () => {
    console.log('JWPlayer event: pause');
    playerRef.position().then(pos => {
      Gemius.sendPause(mediaId, pos ? pos : 0);
    });
  };

  const sendClose = () => {
    console.log('JWPlayer event: close');
    playerRef.position().then(pos => {
      playerRef = null;
      Gemius.sendClose(mediaId, pos ? pos : 0);
    });
  };

  const sendBuffer = () => {
    console.log('JWPlayer event: buffering');
    playerRef.position().then(pos => {
      Gemius.sendBuffer(mediaId, pos ? pos : 0);
    });
  };

  const sendComplete = () => {
    console.log('JWPlayer event: complete');
    playerRef.position().then(pos => {
      Gemius.sendComplete(mediaId, pos ? pos : 0);
    });
  };

  const sendSeek = position => {
    console.log('JWPlayer event: seek ' + position);
    Gemius.sendSeek(mediaId, position);
  };

  return (
    <View style={Styles.htmlContainer}>
      <JWPlayer
        ref={ref => {
          if (playerRef === null || ref !== null) {
            playerRef = ref;
          }
        }}
        style={Styles.embedPlayer}
        playlistItem={createPlaylistItem()}
        nativeFullScreen={true}
        nextUpDisplay={false}
        //landscapeOnFullScreen={true}
        //exitFullScreenOnPortrait={true}
        //fullScreenOnLandscape={true}
        //landscapeOnFullScreen={true}
        onPlay={() => sendPlay()}
        onPause={() => sendPause()}
        onSeeked={e => {
          if (Platform.OS === 'android') {
            sendSeek(e.nativeEvent.position);
          }
        }}
        onSeek={e => {
          if (Platform.OS === 'ios') {
            sendSeek(e.nativeEvent.offset);
          }
        }}
        onBuffer={() => sendBuffer()}
        onComplete={() => sendComplete()}
        onFullScreen={() => {
          if (Platform.OS === 'android') {
            StatusBar.setHidden(true, true);
          }
        }}
        onFullScreenExit={() => {
          if (Platform.OS === 'android') {
            showStatusBar();
          }
        }}
      />
    </View>
  );
};

JWPlayerNative.propTypes = {
  autoPlay: PropTypes.bool,
  streamUri: PropTypes.string,
  mediaId: PropTypes.string,
  title: PropTypes.string,
  backgroundImage: PropTypes.string,
  description: PropTypes.string,
};

JWPlayerNative.defaultProps = {
  autoPlay: true,
};

export default JWPlayerNative;
