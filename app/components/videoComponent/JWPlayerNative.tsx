import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StatusBar, Platform, StyleSheet, ViewStyle} from 'react-native';
import {View} from 'react-native';
import JWPlayer, {PlaylistItem} from 'react-native-jw-media-player';
import Gemius from 'react-native-gemius-plugin';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';

interface Props {
  style?: ViewStyle;
  streamUri: string;
  mediaId: string;
  title: string;
  backgroundImage?: string;
  autoStart: boolean;
  startTime?: number;
  onError?: () => void;
}

const MAX_ERROR_COUNT = 5;
const ERROR_DELAY = 400;

const JWPlayerNative: React.FC<Props> = (props) => {
  const {style, streamUri, mediaId, title, backgroundImage, autoStart, startTime} = props;

  const errorCountRef = useRef<number>(0);
  const playerRef = useRef<JWPlayer>(null);
  const player = playerRef.current;

  useEffect(() => {
    return () => {
      //Cleanup

      /* This fixes the bug on android where user presses back button
       * while video is in fullscreen and status bar does not show up */
      if (Platform.OS === 'android') {
        StatusBar.setHidden(false, 'slide');
        StatusBar.setBarStyle('dark-content', true);
      }
      sendClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendPlay = useCallback(() => {
    console.log('JWPlayer event: play');
    errorCountRef.current = 0;
    player?.position().then((pos) => {
      Gemius.sendPlay(mediaId, pos ? pos : 0);
      console.log('play sent');
    });
  }, [player, mediaId]);

  const sendPause = useCallback(() => {
    console.log('JWPlayer event: pause');
    player?.position().then((pos) => {
      Gemius.sendPause(mediaId, pos ? pos : 0);
      console.log('pause sent');
    });
  }, [player, mediaId]);

  const sendClose = useCallback(() => {
    console.log('JWPlayer event: close');
    player?.position().then((pos) => {
      Gemius.sendClose(mediaId, pos ? pos : 0);
      console.log('close sent');
    });
  }, [player, mediaId]);

  const sendBuffer = useCallback(() => {
    console.log('JWPlayer event: buffering');
    player?.position().then((pos) => {
      Gemius.sendBuffer(mediaId, pos ? pos : 0);
      console.log('buffering sent');
    });
  }, [player, mediaId]);

  const sendComplete = useCallback(() => {
    console.log('JWPlayer event: complete');
    player?.position().then((pos) => {
      Gemius.sendComplete(mediaId, pos ? pos : 0);
      console.log('complete sent');
    });
  }, [player, mediaId]);

  const sendSeek = useCallback(
    (position) => {
      console.log('JWPlayer event: seek ' + position);
      Gemius.sendSeek(mediaId, position);
      console.log('seek sent');
    },
    [mediaId],
  );

  const onError = useCallback(
    (playerError: {error: string}) => {
      console.log('Player error:', playerError);
      setTimeout(() => {
        if (props.onError) {
          props.onError();
        }
        if (errorCountRef.current < MAX_ERROR_COUNT) {
          errorCountRef.current = errorCountRef.current + 1;
        }
      }, errorCountRef.current * ERROR_DELAY);
    },
    [props],
  );

  const playlistItem: PlaylistItem = useMemo(() => {
    return {
      title: title,
      mediaId: mediaId,
      image: backgroundImage ?? VIDEO_DEFAULT_BACKGROUND_IMAGE,
      desc: undefined,
      time: 0,
      file: streamUri,
      autostart: autoStart,
      controls: true,
      repeat: false,
      displayDescription: false,
      startTime: startTime ? startTime : undefined,
      displayTitle: false,
      backgroundAudioEnabled: true,
    };
  }, [title, mediaId, backgroundImage, streamUri, autoStart, startTime]);

  return (
    <View style={[styles.htmlContainer, style]}>
      <JWPlayer
        ref={playerRef}
        style={styles.flex}
        playlistItem={playlistItem}
        nativeFullScreen={true}
        nextUpDisplay={false}
        onPlay={sendPlay}
        onPause={sendPause}
        onSeeked={useCallback(
          (e: any) => {
            //Works on android
            //Also works on iOS but does not have position & offset parameters
            console.log('onSeekedEvent', e?.nativeEvent);
            if (Platform.OS === 'android') {
              if (e.nativeEvent.position !== undefined) {
                sendSeek(e.nativeEvent.position);
              } else {
                console.warn('onSeeked event has no position param');
              }
            }
          },
          [sendSeek],
        )}
        onSeek={useCallback(
          (e: any) => {
            //WORKS ON IOS
            //Also works on android but onSeeked event is more reliable
            console.log('onSeekEvent', e?.nativeEvent);
            if (Platform.OS === 'ios') {
              if (e.nativeEvent.offset !== undefined) {
                sendSeek(e.nativeEvent.offset);
              } else {
                console.warn('onSeek event has no offset param');
              }
            }
          },
          [sendSeek],
        )}
        onBuffer={sendBuffer}
        onComplete={sendComplete}
        onFullScreen={useCallback(() => {
          if (Platform.OS === 'android') {
            StatusBar.setHidden(true, 'slide');
          }
        }, [])}
        onFullScreenExit={useCallback(() => {
          if (Platform.OS === 'android') {
            StatusBar.setHidden(false, 'slide');
            StatusBar.setBarStyle('dark-content', true);
          }
        }, [])}
        onPlayerError={onError}
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
