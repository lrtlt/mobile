import React, {useEffect, useRef} from 'react';
import {StatusBar, Platform, StyleSheet} from 'react-native';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import JWPlayer from 'react-native-jw-media-player';
import Gemius from 'react-native-gemius-plugin';

const DEFAULT_BACKGROUND_IMAGE =
  'https://yt3.ggpht.com/a/AGF-l78bfgG98j-GH2Yw816bbYmnXho-wUselvJM6A=s288-c-k-c0xffffffff-no-rj-mo';

const JWPlayerNative = ({streamUri, mediaId, autoPlay, title, backgroundImage, description, style}) => {
  const playerRef = useRef(null);

  const showStatusBar = () => {
    StatusBar.setHidden(false, true);
    StatusBar.setBarStyle('dark-content', true);
  };

  useEffect(() => {
    return () => {
      //Cleanup

      /* This fixes the bug on android where user presses back button
       * while video is in fullscreen and status bar does not show up */
      if (Platform.OS === 'android') {
        showStatusBar();
      }

      sendClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const image = backgroundImage ? backgroundImage : DEFAULT_BACKGROUND_IMAGE;

  const createPlaylistItem = () => {
    return {
      //playerStyle: 'lrt',
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
    playerRef.current?.position().then((pos) => {
      Gemius.sendPlay(mediaId, pos ? pos : 0);
      console.log('play sent');
    });
  };

  const sendPause = () => {
    console.log('JWPlayer event: pause');
    playerRef.current?.position().then((pos) => {
      Gemius.sendPause(mediaId, pos ? pos : 0);
      console.log('pause sent');
    });
  };

  const sendClose = () => {
    console.log('JWPlayer event: close');
    playerRef.current?.position().then((pos) => {
      Gemius.sendClose(mediaId, pos ? pos : 0);
      console.log('close sent');
    });
  };

  const sendBuffer = () => {
    console.log('JWPlayer event: buffering');
    playerRef.current?.position().then((pos) => {
      Gemius.sendBuffer(mediaId, pos ? pos : 0);
      console.log('buffering sent');
    });
  };

  const sendComplete = () => {
    console.log('JWPlayer event: complete');
    playerRef.current?.position().then((pos) => {
      Gemius.sendComplete(mediaId, pos ? pos : 0);
      console.log('complete sent');
    });
  };

  const sendSeek = (position) => {
    console.log('JWPlayer event: seek ' + position);
    Gemius.sendSeek(mediaId, position);
    console.log('seek sent');
  };

  return (
    <View style={[styles.htmlContainer, style]}>
      <JWPlayer
        ref={playerRef}
        style={styles.flex}
        //playerStyle="lrt"
        playlistItem={createPlaylistItem()}
        nativeFullScreen={true}
        nextUpDisplay={false}
        //landscapeOnFullScreen={true}
        //exitFullScreenOnPortrait={true}
        //fullScreenOnLandscape={true}
        //landscapeOnFullScreen={true}
        onPlay={() => sendPlay()}
        onPause={() => sendPause()}
        onSeeked={(e) => {
          if (Platform.OS === 'android') {
            sendSeek(e.nativeEvent.position);
          }
        }}
        onSeek={(e) => {
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  htmlContainer: {
    flex: 1,
    overflow: 'hidden',
    opacity: 0.99,
  },
});
