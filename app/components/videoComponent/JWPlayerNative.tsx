import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StatusBar, Platform, StyleSheet, ViewStyle} from 'react-native';
import {View} from 'react-native';
import JWPlayer from 'react-native-jw-media-player';
import Gemius from 'react-native-gemius-plugin';

const DEFAULT_BACKGROUND_IMAGE =
  'https://yt3.ggpht.com/a/AGF-l78bfgG98j-GH2Yw816bbYmnXho-wUselvJM6A=s288-c-k-c0xffffffff-no-rj-mo';

interface Props {
  style?: ViewStyle;
  streamUri: string;
  mediaId: string;
  title: string;
  backgroundImage?: string;
  autoStart: boolean;
}

const JWPlayerNative: React.FC<Props> = (props) => {
  const {style, streamUri, mediaId, title, backgroundImage, autoStart} = props;
  const playerRef = useRef<JWPlayer>(null);

  const showStatusBar = useCallback(() => {
    StatusBar.setHidden(false, 'slide');
    StatusBar.setBarStyle('dark-content', true);
  }, []);

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

  const sendPlay = useCallback(() => {
    console.log('JWPlayer event: play');
    playerRef.current?.position().then((pos) => {
      Gemius.sendPlay(mediaId, pos ? pos : 0);
      console.log('play sent');
    });
  }, [playerRef, mediaId]);

  const sendPause = useCallback(() => {
    console.log('JWPlayer event: pause');
    playerRef.current?.position().then((pos) => {
      Gemius.sendPause(mediaId, pos ? pos : 0);
      console.log('pause sent');
    });
  }, [playerRef, mediaId]);

  const sendClose = useCallback(() => {
    console.log('JWPlayer event: close');
    playerRef.current?.position().then((pos) => {
      Gemius.sendClose(mediaId, pos ? pos : 0);
      console.log('close sent');
    });
  }, [playerRef, mediaId]);

  const sendBuffer = useCallback(() => {
    console.log('JWPlayer event: buffering');
    playerRef.current?.position().then((pos) => {
      Gemius.sendBuffer(mediaId, pos ? pos : 0);
      console.log('buffering sent');
    });
  }, [playerRef, mediaId]);

  const sendComplete = useCallback(() => {
    console.log('JWPlayer event: complete');
    playerRef.current?.position().then((pos) => {
      Gemius.sendComplete(mediaId, pos ? pos : 0);
      console.log('complete sent');
    });
  }, [playerRef, mediaId]);

  const sendSeek = useCallback(
    (position) => {
      console.log('JWPlayer event: seek ' + position);
      Gemius.sendSeek(mediaId, position);
      console.log('seek sent');
    },
    [playerRef, mediaId],
  );

  const playlistItem = useMemo(() => {
    return {
      //playerStyle: 'lrt',
      title: title,
      mediaId: mediaId,
      image: backgroundImage ?? DEFAULT_BACKGROUND_IMAGE,
      desc: undefined,
      time: 0,
      file: streamUri,
      autostart: autoStart,
      controls: true,
      repeat: false,
      displayDescription: false,
      displayTitle: false,
      backgroundAudioEnabled: true,
    };
  }, [title, mediaId, streamUri, autoStart, backgroundImage]);

  return (
    <View style={[styles.htmlContainer, style]}>
      <JWPlayer
        ref={playerRef}
        style={styles.flex}
        //playerStyle="lrt"
        playlistItem={playlistItem}
        nativeFullScreen={true}
        nextUpDisplay={false}
        //landscapeOnFullScreen={true}
        //exitFullScreenOnPortrait={true}
        //fullScreenOnLandscape={true}
        //landscapeOnFullScreen={true}
        onPlay={() => sendPlay()}
        onPause={() => sendPause()}
        onSeeked={(e) => {
          console.log('onSeekedEvent', e);
          if (Platform.OS === 'android') {
            sendSeek(e.nativeEvent.position);
          }
        }}
        onSeek={(e) => {
          console.log('onSeekEvent', e);
          if (Platform.OS === 'ios') {
            sendSeek(e.nativeEvent.offset);
          }
        }}
        onBuffer={() => sendBuffer()}
        onComplete={() => sendComplete()}
        onFullScreen={() => {
          if (Platform.OS === 'android') {
            StatusBar.setHidden(true, 'slide');
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

export default JWPlayerNative;

JWPlayerNative.defaultProps = {
  autoStart: true,
};

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