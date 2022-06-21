import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ImageBackground, Platform, StyleSheet, View, ViewStyle} from 'react-native';
import {
  PlayerConfiguration,
  SourceDescription,
  THEOplayerView,
  ErrorEvent,
  THEOplayer,
  PlayerEventType,
  LoadedMetadataEvent,
  Event,
  TimeUpdateEvent,
} from 'react-native-theoplayer';
import MediaControls from './MediaControls';
import {useVideo} from './context/useVideo';
import {PlayerMode} from './PlayerMode';
import {MediaType} from './context/VideoContext';

interface Props {
  style?: ViewStyle;
  mode?: PlayerMode;
  mediaType: MediaType;
  streamUri: string;
  title?: string;
  poster?: string;
  autoStart: boolean;
  startTime?: number;
  onError?: (e?: any) => void;
}

const license = Platform.select({
  android:
    'sZP7IYe6T6Pe3uPKTuX136ztIuhtFSacIQC-ClhoTOziTuR_3D4e3uetIS06FOPlUY3zWokgbgjNIOf9fKCi0L0cTSRtFDCkIlR-3Q363ZzrTuarFS0L0SA1ISerIl3K0mfVfK4_bQgZCYxNWoryIQXzImf90SbiTSf_3Lfi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lbk0SCk3SbcTS5tFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkImi6IK41Uw4ZIY06Tg-Uya',
  ios:
    'sZP7IYe6T6Pe3uPKTuX136ztIuhtFSacIQC-ClhoTOziTuR_3D4e3uetIS06FOPlUY3zWokgbgjNIOf9fKCi0L0cTSRtFDCkIlR-3Q363ZzrTuarFS0L0SA1ISerIl3K0mfVfK4_bQgZCYxNWoryIQXzImf90SbiTSf_3Lfi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lbk0SCk3SbcTS5tFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkImi6IK41Uw4ZIY06Tg-Uya',
});

const config: PlayerConfiguration = {
  license,
  chromeless: true,
  mediaControl: {
    mediaSessionEnabled: true,
  },
};

const makeSource = (uri: string): SourceDescription => ({
  sources: [
    {
      src: uri,
    },
  ],
});

const TheoMediaPlayer: React.FC<Props> = ({
  style,
  streamUri,
  mode = PlayerMode.DEFAULT,
  mediaType,
  title,
  poster,
  autoStart,
  startTime,
  onError,
}) => {
  const [player, setPlayer] = useState<THEOplayer>();
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, setCurrentTimeInternal] = useState(0);

  const {
    setCurrentTime,
    getCurrentTime,

    isPausedByUser,
    setIsPausedByUser,

    isFullScreen,
    setIsFullScreen,

    setVideoBaseData,
    registerFullScreenListener,
    unregisterFullScreenListener,
  } = useVideo();

  useEffect(() => {
    const key = `${mode}-${Math.random() * Math.pow(10, 8)}`;

    registerFullScreenListener(key, {
      onFullScreenEnter: () => {
        if (mode === PlayerMode.DEFAULT) {
          player?.pause();
        }
      },
      onFullScreenExit: () => {
        if (player) {
          if (mode === PlayerMode.DEFAULT) {
            player.currentTime = getCurrentTime();
            isPausedByUser ? player?.pause() : player?.play();
          }
          if (mode === PlayerMode.FULLSCREEN) {
            player.pause();
          }
        }
      },
    });
    return () => unregisterFullScreenListener(key);
  }, [
    duration,
    getCurrentTime,
    isPausedByUser,
    player,
    mode,
    registerFullScreenListener,
    unregisterFullScreenListener,
  ]);

  const onLoadedMetaDataHandler = useCallback((e: LoadedMetadataEvent) => {
    //console.log('Metadata:', e);
    setDuration(e.duration === Infinity ? 0 : e.duration);
    setVideoBaseData({
      mediaType: mediaType,
      poster: poster,
      title: title,
      uri: streamUri,
    });
    setIsLoading(false);
  }, []);

  const onPauseHandler = useCallback((e: Event<PlayerEventType.PAUSE>) => {
    setIsPausedByUser(true);
  }, []);

  const onPlayHandler = useCallback((e: Event<PlayerEventType.PLAY>) => {
    setIsPausedByUser(false);
  }, []);

  const onTimeUpdateHandler = useCallback(
    (e: TimeUpdateEvent) => {
      setCurrentTime(e.currentTime);
      setCurrentTimeInternal(e.currentTime);
    },
    [player],
  );

  const onErrorHandler = useCallback(
    (e: ErrorEvent) => {
      console.log('Player error:', e);
      if (onError) {
        onError();
      }
    },
    [onError],
  );

  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);
    //player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.LOADED_DATA, (event) => {
      console.log(event);
    });
    player.addEventListener(PlayerEventType.ERROR, onErrorHandler);
    player.addEventListener(PlayerEventType.LOADED_METADATA, onLoadedMetaDataHandler);
    //player.addEventListener(PlayerEventType.WAITING, console.log);
    //player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    // player.addEventListener(PlayerEventType.PLAYING, console.log);
    player.addEventListener(PlayerEventType.PLAY, onPlayHandler);
    player.addEventListener(PlayerEventType.PAUSE, onPauseHandler);
    // player.addEventListener(PlayerEventType.SEEKING, console.log);
    // player.addEventListener(PlayerEventType.SEEKED, console.log);
    // player.addEventListener(PlayerEventType.ENDED, console.log);
    player.addEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdateHandler);
    player.source = makeSource(streamUri);
    player.backgroundAudioConfiguration = {enabled: true};
    player.autoplay = autoStart;
    player.muted = false;
    player.currentTime = startTime ?? 0;
    //player.pipConfiguration = {startsAutomatically: true};
  };

  return (
    <View style={styles.container}>
      <>
        <THEOplayerView style={styles.video} config={config} onPlayerReady={onPlayerReady} />
        <ImageBackground source={{uri: poster}} style={styles.video} resizeMode="cover" />
        {!isLoading && player ? (
          <MediaControls
            enabled={true}
            currentTime={getCurrentTime() / 1000}
            mediaDuration={duration / 1000}
            isMuted={player.muted ?? false}
            isPaused={player.paused}
            loading={isLoading}
            isBuffering={player.seeking}
            enableFullScreen={true}
            enableMute={false}
            title={title}
            onPlayPausePress={() => (player.paused ? player.play() : player.pause())}
            onMutePress={() => {
              player.volume < 1 ? (player.volume = 1.0) : (player.volume = 0.0);
            }}
            onFullScreenPress={() => {
              setIsFullScreen(!isFullScreen);
            }}
            onSeekRequest={(time) => (player.currentTime = time * 1000)}
            onSeekByRequest={(time) => (player.currentTime += time * 1000)}
          />
        ) : null}
      </>
    </View>
  );
};

export default TheoMediaPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});
