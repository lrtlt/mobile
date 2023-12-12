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
import Gemius from 'react-native-gemius-plugin';
import useChromecast from './useChromecast';
import {MediaPlayerState} from 'react-native-google-cast';

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

  const {client, mediaStatus} = useChromecast({
    player: player,
    mediaType: mediaType,
    streamUri: streamUri,
    title: title,
    poster: poster,
    isLiveStream: isLiveStream,
  });

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
    const duration = e.duration === Infinity ? 0 : e.duration;
    Gemius.setProgramData(streamUri, title ?? '', duration, mediaType === MediaType.VIDEO);
    setDuration(duration);

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
    console.log(player?.duration);

    //Gemius.setProgramData(streamUri, title ?? '', duration, mediaType === MediaType.VIDEO);
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
    Gemius.setProgramData(streamUri, title ?? '', 0, mediaType === MediaType.VIDEO);
    setPlayer(player);
    // player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    // player.addEventListener(PlayerEventType.PROGRESS, console.log);
    // player.addEventListener(PlayerEventType.LOAD_START, console.log);
    // player.addEventListener(PlayerEventType.WAITING, console.log);
    player.addEventListener(PlayerEventType.ERROR, onErrorHandler);
    player.addEventListener(PlayerEventType.LOADED_METADATA, onLoadedMetaDataHandler);
    player.addEventListener(PlayerEventType.CAST_EVENT, console.log);
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
    player.backgroundAudioConfiguration = {enabled: true};
    player.autoplay = autoStart;
    player.preload = 'auto';
    player.muted = false;
    player.pipConfiguration = {
      //TODO: enable on android after the fix on TheoPlayer side
      startsAutomatically: Platform.OS === 'ios',
    };

    if (!isLiveStream) {
      player.currentTime = startTime ? startTime * 1000 : 0;
    }
    player.aspectRatio = AspectRatio.FIT;

    if (player.abr) {
      player.abr!.strategy = ABRStrategyType.bandwidth;
    }
    // console.log('audioTracks:', player.audioTracks);
    // console.log('videoTracks:', player.videoTracks);
    // console.log('targetVideoQuality:', player.targetVideoQuality);
    //player.playbackRate = 1.5;
    //player.selectedVideoTrack = player.videoTracks[0];
    //player.pipConfiguration = {startsAutomatically: true};
    player.source = makeSource(streamUri, title, poster);
  };

  const _playPauseControl = useCallback(async () => {
    if (client) {
      if (mediaStatus?.playerState === MediaPlayerState.PLAYING) {
        client?.pause();
        player?.pause();
      } else {
        client?.play();
      }
    } else if (player) {
      if (player.paused) {
        player.play();
        setIsPausedByUser(false);
      } else {
        player.pause();
        setIsPausedByUser(true);
      }
    }
  }, [player, client, mediaStatus, setIsPausedByUser]);

  const _fullScreenControl = useCallback(() => setIsFullScreen(!isFullScreen), [isFullScreen]);

  const _seekControl = useCallback(
    (time) => {
      if (player) {
        trackSeek(streamUri, time);
        player.currentTime = time * 1000;
        client?.seek({position: time});
      }
    },
    [player, client],
  );

  const _seekByControl = useCallback(
    (time) => {
      if (player) {
        const newTime = player.currentTime + time * 1000;
        trackSeek(streamUri, newTime / 1000);
        player.currentTime = newTime;
        client?.seek({position: time, relative: true});
      }
    },
    [player, client],
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
            isPaused={mediaStatus ? mediaStatus?.playerState === MediaPlayerState.PAUSED : player.paused}
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
