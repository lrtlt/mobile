import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
  AspectRatio,
  ABRStrategyType,
} from 'react-native-theoplayer';
import MediaControls from './MediaControls';
import {useVideo} from './context/useVideo';
import {PlayerMode} from './PlayerMode';
import {MediaType} from './context/VideoContext';
import useMediaTracking from './useMediaTracking';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import {uniqueId} from 'lodash';

interface Props {
  style?: ViewStyle;
  mode?: PlayerMode;
  mediaType: MediaType;
  streamUri: string;
  isLiveStream: boolean;
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

const makeSource = (uri: string, title?: string, poster?: string): SourceDescription => ({
  poster: poster,
  metadata: {
    title: title,
  },
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
  poster = VIDEO_DEFAULT_BACKGROUND_IMAGE,
  autoStart,
  isLiveStream,
  startTime,
  onError,
}) => {
  const [player, setPlayer] = useState<THEOplayer>();
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, setCurrentTimeInternal] = useState(0);

  const {trackPlay, trackPause, trackBuffer, trackClose, trackComplete, trackSeek} = useMediaTracking();

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
    return () => {
      if (mode === PlayerMode.DEFAULT) {
        trackClose(streamUri, getCurrentTime());
      }
    };
  }, [streamUri]);

  useEffect(() => {
    if (player?.seeking === true) {
      trackBuffer(streamUri, player.currentTime / 1000);
    }
    if (player?.seeking === false) {
      if (player?.paused) {
        trackPause(streamUri, player.currentTime / 1000);
      } else {
        trackPlay(streamUri, player.currentTime / 1000);
      }
    }
  }, [player?.seeking]);

  useEffect(() => {
    const key = uniqueId(`${mode}-`);

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
    getCurrentTime,
    isPausedByUser,
    isLiveStream,
    player,
    mode,
    registerFullScreenListener,
    unregisterFullScreenListener,
  ]);

  const onLoadedMetaDataHandler = useCallback((e: LoadedMetadataEvent) => {
    setDuration(e.duration === Infinity ? 0 : e.duration);
    setVideoBaseData({
      mediaType: mediaType,
      poster: poster,
      title: title,
      uri: streamUri,
      isLiveStream: isLiveStream,
    });
    setIsLoading(false);
  }, []);

  const onPauseHandler = useCallback((_: Event<PlayerEventType.PAUSE>) => {
    trackPause(streamUri, getCurrentTime() / 1000);
  }, []);

  const onPlayHandler = useCallback((_: Event<PlayerEventType.PLAY>) => {
    setIsPausedByUser(false);
    trackPlay(streamUri, getCurrentTime() / 1000);
  }, []);

  const onEndedHandler = useCallback((_: Event<PlayerEventType.ENDED>) => {
    trackComplete(streamUri, getCurrentTime() / 1000);
  }, []);

  const onTimeUpdateHandler = useCallback((e: TimeUpdateEvent) => {
    setCurrentTime(e.currentTime);
    setCurrentTimeInternal(e.currentTime);
  }, []);

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
    // player.addEventListener(PlayerEventType.PROGRESS, console.log);
    // player.addEventListener(PlayerEventType.LOAD_START, console.log);
    // player.addEventListener(PlayerEventType.WAITING, console.log);
    player.addEventListener(PlayerEventType.ERROR, onErrorHandler);
    player.addEventListener(PlayerEventType.LOADED_METADATA, onLoadedMetaDataHandler);
    //player.addEventListener(PlayerEventType.WAITING, console.log);
    //player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    // player.addEventListener(PlayerEventType.PLAYING, console.log);
    player.addEventListener(PlayerEventType.PLAY, onPlayHandler);
    player.addEventListener(PlayerEventType.PAUSE, onPauseHandler);
    // player.addEventListener(PlayerEventType.SEEKING, console.log);
    // player.addEventListener(PlayerEventType.SEEKED, console.log);
    player.addEventListener(PlayerEventType.ENDED, onEndedHandler);
    // player.addEventListener(PlayerEventType.ENDED, console.log);
    player.addEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdateHandler);
    //player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, (e) => console.log(JSON.stringify(e, null, 4)));
    player.source = makeSource(streamUri, title, poster);
    player.backgroundAudioConfiguration = {enabled: true};
    player.autoplay = autoStart;
    player.preload = 'auto';
    player.muted = false;
    player.pipConfiguration = {
      //TODO: enable on android after the fix on TheoPlayer side
      startsAutomatically: Platform.OS === 'ios',
    };
    //player.selectedAudioTrack = 113;

    if (!isLiveStream) {
      player.currentTime = startTime ? startTime * 1000 : 0;
    }
    player.aspectRatio = AspectRatio.FIT;

    if (player.abr) {
      player.abr!.strategy = ABRStrategyType.performance;
      player.abr.targetBuffer = 15;
    }
    // console.log('audioTracks:', player.audioTracks);
    // console.log('videoTracks:', player.videoTracks);
    // console.log('targetVideoQuality:', player.targetVideoQuality);
    //player.playbackRate = 1.5;
    //player.selectedVideoTrack = player.videoTracks[0];
    //player.pipConfiguration = {startsAutomatically: true};
  };

  const _playPauseControl = useCallback(() => {
    if (player) {
      if (player.paused) {
        setIsPausedByUser(false);
        player.play();
      } else {
        setIsPausedByUser(true);
        player.pause();
      }
    }
  }, [player, setIsPausedByUser]);

  const _fullScreenControl = useCallback(() => setIsFullScreen(!isFullScreen), [isFullScreen]);

  const _seekControl = useCallback(
    (time) => {
      if (player) {
        trackSeek(streamUri, time);
        player.currentTime = time * 1000;
      }
    },
    [player],
  );

  const _seekByControl = useCallback(
    (time) => {
      if (player) {
        const newTime = player.currentTime + time * 1000;
        trackSeek(streamUri, newTime / 1000);
        player.currentTime = newTime;
      }
    },
    [player],
  );

  return (
    <View style={styles.container}>
      <>
        <THEOplayerView style={styles.video} config={config} onPlayerReady={onPlayerReady} />
        {mediaType == MediaType.AUDIO ? (
          <ImageBackground source={{uri: poster}} style={styles.video} resizeMode="contain" />
        ) : null}
        {!isLoading && player ? (
          <MediaControls
            enabled={true}
            currentTime={getCurrentTime() / 1000}
            mediaDuration={duration / 1000}
            isMuted={player.muted ?? false}
            isPaused={player.paused}
            loading={isLoading}
            isBuffering={player.seeking && !player.paused}
            enableFullScreen={mediaType == MediaType.VIDEO}
            enableMute={false}
            title={title}
            onPlayPausePress={_playPauseControl}
            onMutePress={() => {}}
            onFullScreenPress={_fullScreenControl}
            onSeekRequest={_seekControl}
            onSeekByRequest={_seekByControl}
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
