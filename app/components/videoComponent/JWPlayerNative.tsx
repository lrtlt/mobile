import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StatusBar, Platform, StyleSheet, ViewStyle} from 'react-native';
import {View} from 'react-native';
import JWPlayer, {Config, PlaylistItem} from 'react-native-jw-media-player';
import Gemius from 'react-native-gemius-plugin';
import {
  JW_PLAYER_LICENSE_ANDROID,
  JW_PLAYER_LICENSE_IOS,
  VIDEO_DEFAULT_BACKGROUND_IMAGE,
} from '../../constants';

interface Props {
  style?: ViewStyle;
  streamUri: string;
  mediaId: string;
  title: string;
  backgroundImage?: string;
  autoStart: boolean;
  startTime?: number;
}

const JWPlayerNative: React.FC<Props> = ({
  style,
  streamUri,
  mediaId,
  title,
  backgroundImage,
  autoStart = true,
  startTime,
}) => {
  const playerRef = useRef<JWPlayer>(null);

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
    playerRef.current?.position().then((pos) => {
      Gemius.sendPlay(mediaId, pos ? pos : 0);
      console.log('play sent');
    });
  }, [mediaId]);

  const sendPause = useCallback(() => {
    console.log('JWPlayer event: pause');
    playerRef.current?.position().then((pos) => {
      Gemius.sendPause(mediaId, pos ? pos : 0);
      console.log('pause sent');
    });
  }, [mediaId]);

  const sendClose = useCallback(() => {
    console.log('JWPlayer event: close');
    playerRef.current?.position().then((pos) => {
      Gemius.sendClose(mediaId, pos ? pos : 0);
      console.log('close sent');
    });
  }, [mediaId]);

  const sendBuffer = useCallback(() => {
    console.log('JWPlayer event: buffering');
    playerRef.current?.position().then((pos) => {
      Gemius.sendBuffer(mediaId, pos ? pos : 0);
      console.log('buffering sent');
    });
  }, [mediaId]);

  const sendComplete = useCallback(() => {
    console.log('JWPlayer event: complete');
    playerRef.current?.position().then((pos) => {
      Gemius.sendComplete(mediaId, pos ? pos : 0);
      console.log('complete sent');
    });
  }, [mediaId]);

  const sendSeek = useCallback(
    (position) => {
      console.log('JWPlayer event: seek ' + position);
      Gemius.sendSeek(mediaId, position);
      console.log('seek sent');
    },
    [mediaId],
  );

  const onError = useCallback((playerError: {error: string}) => {
    console.warn('Player error:', playerError);
    setTimeout(() => {
      if (playerRef.current) {
        console.log('Force updating player...');
        playerRef.current?.forceUpdate(() => console.log('Update complete'));
      }
    }, 400);
  }, []);

  const config: Config = useMemo(() => {
    const _playlistItem: PlaylistItem = {
      title: title || '',
      mediaId: mediaId || '-1',
      image: backgroundImage || VIDEO_DEFAULT_BACKGROUND_IMAGE,
      file: streamUri,
      autostart: autoStart,
      startTime: startTime || 0,
    };

    const _cfg: Config = {
      license:
        Platform.select({
          ios: JW_PLAYER_LICENSE_IOS,
          android: JW_PLAYER_LICENSE_ANDROID,
        }) ?? '',
      controls: true,
      viewOnly: false,
      repeat: false,
      playlist: [_playlistItem],
      interfaceBehavior: 'normal',
      autostart: autoStart,
      backgroundAudioEnabled: true,
      enableLockScreenControls: true,

      //Fullscreen logic
      landscapeOnFullScreen: false,
      fullScreenOnLandscape: false,
      exitFullScreenOnPortrait: false,
      portraitOnExitFullScreen: false,

      //Styling
      // styling: {
      //   displayTitle: true,
      //   displayDescription: false,
      //   menuStyle: {
      //     backgroundColor: '000000',
      //     fontColor: 'FFFFFF',
      //   },
      //   colors: {
      //     backgroundColor: '000000',
      //     buttons: 'FFFFFF',
      //     fontColor: 'FFFFFF',
      //     timeslider: {
      //       progress: 'FFFFFF',
      //       rail: 'AAAAAA',
      //       thumb: 'FFFFFF',
      //     },
      //   },
      // },
    };
    return _cfg;
  }, [autoStart, backgroundImage, mediaId, startTime, streamUri, title]);

  return (
    <View style={[styles.htmlContainer, style]}>
      <JWPlayer
        ref={playerRef}
        style={styles.flex}
        config={config}
        controls={true}
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
