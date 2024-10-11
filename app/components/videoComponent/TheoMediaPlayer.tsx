import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, BackHandler, Platform, StyleSheet, View} from 'react-native';
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
  ReadyStateChangeEvent,
  PresentationMode,
  PresentationModeChangeEvent,
} from 'react-native-theoplayer';
import MediaControls from './MediaControls';
import {useMediaPlayer} from './context/useMediaPlayer';
import {MediaType} from './context/PlayerContext';
import useMediaTracking from './useMediaTracking';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import useChromecast from './useChromecast';
import {MediaPlayerState} from 'react-native-google-cast';
import {useTheme} from '../../Theme';
import usePlayerLanguage from './usePlayerLanguage';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import {VideoTextTrack} from '../../api/Types';
import usePlayerSubtitles from './usePlayerSubtitles';
import Orientation from 'react-native-orientation-locker';
import {useSettingsStore} from '../../state/settings_store';

export type PlayerAction = 'togglePlay' | 'setFullScreen';

interface Props {
  mediaType: MediaType;
  streamUri: string;
  isLiveStream: boolean;
  title?: string;
  poster?: string;
  autoStart: boolean;
  startTime?: number;
  isMini?: boolean;
  minifyEnabled?: boolean;
  uuid?: string;
  controls?: boolean;
  loop?: boolean;
  aspectRatio?: number;
  backgroundAudioEnabled?: boolean;
  tracks?: VideoTextTrack[];
  onError?: (e?: any) => void;
  onEnded?: () => void;
}

const config: PlayerConfiguration = {
  license: Platform.select({
    android:
      'sZP7IYe6T6Pe3uPKTuX136ztIuhtFSacIQC-ClhoTOziTuR_3D4e3uetIS06FOPlUY3zWokgbgjNIOf9fKCi0L0cTSRtFDCkIlR-3Q363ZzrTuarFS0L0SA1ISerIl3K0mfVfK4_bQgZCYxNWoryIQXzImf90SbiTSf_3Lfi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lbk0SCk3SbcTS5tFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkImi6IK41Uw4ZIY06Tg-Uya',
    ios: 'sZP7IYe6T6Pe3uPKTuX136ztIuhtFSacIQC-ClhoTOziTuR_3D4e3uetIS06FOPlUY3zWokgbgjNIOf9fKCi0L0cTSRtFDCkIlR-3Q363ZzrTuarFS0L0SA1ISerIl3K0mfVfK4_bQgZCYxNWoryIQXzImf90SbiTSf_3Lfi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lbk0SCk3SbcTS5tFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkImi6IK41Uw4ZIY06Tg-Uya',
  }),
  chromeless: true,
};

const makeSource = (
  uri: string,
  title?: string,
  poster?: string,
  tracks?: VideoTextTrack[],
): SourceDescription => ({
  poster: poster,
  metadata: {
    title: title,
    // subtitle: title,
    // album: 'Album',
    displayIconUri: poster,
    // artist: 'Artist',
    // nowPlayingServiceIdentifier: 'lrt-nowPlayingServiceIdentifier',
    // nowPlayingContentIdentifier: 'lrt-nowPlayingContentIdentifier',
  },
  sources: [
    {
      src: uri,
      // src: 'https://cdn.theoplayer.com/video/elephants-dream/playlistCorrectionENG.m3u8',
      // type: 'application/x-mpegurl',
    },
  ],
  // textTracks: [
  //   {
  //     default: true,
  //     src: 'https://www.lrt.lt/media/VIDEO/2024-07/ZIN42126_W_828f0acf-e712-4f53-a1c3-7f4ba05dea2a.txt',
  //     label: 'LRT Test',
  //     kind: 'subtitles',
  //     srclang: 'lt',
  //   },
  // ],
  textTracks: tracks,
});

const TheoMediaPlayer: React.FC<React.PropsWithChildren<Props>> = ({
  streamUri,
  mediaType,
  title,
  poster = VIDEO_DEFAULT_BACKGROUND_IMAGE,
  autoStart,
  isLiveStream,
  startTime,
  tracks,
  isMini = false,
  loop = false,
  minifyEnabled = true,
  uuid,
  controls = true,
  aspectRatio = 16 / 9,
  backgroundAudioEnabled = true,
  onError,
  onEnded,
}) => {
  const [player, setPlayer] = useState<THEOplayer>();
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTimeInternal] = useState(0);

  const {trackPlay, trackPause, trackBuffer, trackClose, trackComplete, trackSeek} = useMediaTracking();

  const {colors} = useTheme();
  const isContinuousPlayEnabled = useSettingsStore((state) => state.isContinuousPlayEnabled);

  const {setMediaData, close} = useMediaPlayer();

  //Close isMini player before loading new one
  useEffect(() => {
    if (!isMini) {
      close();
    }
  }, []);

  const {client, mediaStatus} = useChromecast({
    player: player,
    mediaType: mediaType,
    streamUri: streamUri,
    title: title,
    poster: poster,
    isLiveStream: isLiveStream,
  });

  useEffect(() => {
    return () => {
      if (player) {
        const isPlaying = !player.paused;
        const isCasting = !!client;

        if (isContinuousPlayEnabled && !isCasting && isPlaying && !isMini && minifyEnabled) {
          setMediaData({
            mediaType: mediaType,
            poster: poster,
            title: title,
            uri: streamUri,
            isLiveStream: isLiveStream,
            startTime: player.currentTime / 1000,
            tracks: tracks,
          });
        }
        trackClose(streamUri, player.currentTime / 1000);
      }
    };
  }, [player, streamUri, isContinuousPlayEnabled, client]);

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (player && player.presentationMode === PresentationMode.fullscreen) {
        player.presentationMode = PresentationMode.inline;
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [player]);

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

  const onLoadedMetaDataHandler = useCallback((e: LoadedMetadataEvent) => {
    const duration = e.duration === Infinity ? 0 : e.duration;
    setDuration(duration);
  }, []);

  const onLoadedDataHandler = useCallback((e: Event<PlayerEventType.LOADED_DATA>) => {
    Gemius.setProgramData(streamUri, title ?? '', duration, mediaType === MediaType.VIDEO);
    setIsLoading(false);
  }, []);

  const onPauseHandler = useCallback(
    (player: THEOplayer) => (_: Event<PlayerEventType.PAUSE>) => {
      trackPause(streamUri, player.currentTime / 1000);
      setIsPlaying(false);
    },
    [],
  );

  const onPlayHandler = useCallback(
    (player: THEOplayer) => (_: Event<PlayerEventType.PLAY>) => {
      if (player?.currentTime) {
        trackPlay(streamUri, player.currentTime / 1000);
      } else {
        trackPlay(streamUri, startTime ?? 0);
      }
      setIsPlaying(true);
    },
    [],
  );

  const onEndedHandler = useCallback(
    (player: THEOplayer) => (_: Event<PlayerEventType.ENDED>) => {
      trackComplete(streamUri, player.currentTime / 1000);
      setIsPlaying(false);

      if (loop) {
        setTimeout(() => {
          player.play();
        }, 600);
      }

      if (onEnded) {
        onEnded();
      }
    },
    [onEnded, loop],
  );

  useEffect(() => {
    player?.addEventListener(PlayerEventType.ENDED, onEndedHandler(player));
    return () => {
      player?.removeEventListener(PlayerEventType.ENDED, onEndedHandler(player));
    };
  }, [onEndedHandler, player]);

  const onTimeUpdateHandler = useCallback((e: TimeUpdateEvent) => {
    setCurrentTimeInternal(e.currentTime);
  }, []);

  const onReadyStateChangeHandler = useCallback((e: ReadyStateChangeEvent) => {
    //https://docs.theoplayer.com/api-reference/ios/Enums/ReadyState.html#/c:@M@THEOplayerSDK@E@THEOplayerReadyState@THEOplayerReadyStateHAVE_ENOUGH_DATA
    // const isReady = e.readyState > 2;
    // setIsLoading(!isReady);
  }, []);

  const onPresentationChangeHandler = useCallback((e: PresentationModeChangeEvent) => {
    if (Platform.OS === 'android') {
      if (e.presentationMode === PresentationMode.fullscreen) {
        setTimeout(() => {
          Orientation.unlockAllOrientations();
        }, 250);
      } else {
        Orientation.lockToPortrait();
      }
    }
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
    player.addEventListener(PlayerEventType.LOADED_DATA, onLoadedDataHandler);
    //player.addEventListener(PlayerEventType.CAST_EVENT, console.log);
    //player.addEventListener(PlayerEventType.WAITING, console.log);
    //player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    // player.addEventListener(PlayerEventType.PLAYING, console.log);
    player.addEventListener(PlayerEventType.PLAY, onPlayHandler(player));
    player.addEventListener(PlayerEventType.PAUSE, onPauseHandler(player));
    // player.addEventListener(PlayerEventType.SEEKING, console.log);

    // player.addEventListener(PlayerEventType.ENDED, onEndedHandler(player));
    // player.addEventListener(PlayerEventType.ENDED, console.log);
    player.addEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdateHandler);
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, onReadyStateChangeHandler);
    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, onPresentationChangeHandler);
    player.backgroundAudioConfiguration = {enabled: backgroundAudioEnabled};

    player.autoplay = autoStart;
    player.preload = 'auto';
    player.muted = false;
    player.pipConfiguration = {
      //TODO: enable on android after the fix on TheoPlayer side
      startsAutomatically: backgroundAudioEnabled && Platform.OS === 'ios',
    };

    player.aspectRatio = AspectRatio.FIT;

    //TODO: test if this is needed
    // if (player.abr) {
    //   player.abr!.strategy = ABRStrategyType.bandwidth;
    // }

    // console.log('audioTracks:', player.audioTracks);
    // console.log('videoTracks:', player.videoTracks);
    // console.log('targetVideoQuality:', player.targetVideoQuality);
    //player.playbackRate = 1.5;
    //player.selectedVideoTrack = player.videoTracks[0];
  };

  useEffect(() => {
    if (player && streamUri) {
      player.source = makeSource(streamUri, title, poster, tracks);
      if (!isLiveStream) {
        console.log('startTime:', startTime);
        player.currentTime = startTime ? startTime * 1000 : 0;
      }
    }
  }, [player, streamUri, startTime, isLiveStream, title, poster, tracks]);

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
      } else {
        player.pause();
      }
    }
  }, [player, client, mediaStatus]);

  const _fullScreenControl = useCallback(() => {
    if (player) {
      if (player.presentationMode === PresentationMode.fullscreen) {
        player.presentationMode = PresentationMode.inline;
      } else {
        player.presentationMode = PresentationMode.fullscreen;
      }
    }
  }, [player]);

  const _seekControl = useCallback(
    (time: number) => {
      if (player) {
        trackSeek(streamUri, time);
        player.currentTime = time * 1000;
        client?.seek({position: time});
      }
    },
    [player, client],
  );

  const _seekByControl = useCallback(
    (time: number) => {
      if (player) {
        const newTime = player.currentTime + time * 1000;
        trackSeek(streamUri, newTime / 1000);
        player.currentTime = newTime;
        client?.seek({position: time, relative: true});
      }
    },
    [player, client],
  );

  useEffect(() => {
    if (!uuid) {
      return;
    }

    const listener = EventRegister.addEventListener(uuid, (action: PlayerAction) => {
      switch (action) {
        case 'togglePlay':
          _playPauseControl();
          break;
        case 'setFullScreen':
          _fullScreenControl();
          break;
      }
    });

    return () => {
      EventRegister.removeEventListener(listener as string);
    };
  }, [uuid, _playPauseControl, _fullScreenControl]);

  const {LanguageButton, LanguageMenu} = usePlayerLanguage({player: player});
  const {SubtitlesButton, SubtitlesMenu} = usePlayerSubtitles({player: player});

  return (
    <View style={{...styles.container, aspectRatio}}>
      <THEOplayerView style={styles.video} config={config} onPlayerReady={onPlayerReady}>
        <>
          {isLoading && (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator size="large" animating={isLoading} color={colors.primary} />
            </View>
          )}
          {!isLoading && player ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {mediaType == MediaType.AUDIO ? (
                <FastImage
                  source={{uri: poster}}
                  style={{width: '100%', position: 'absolute', aspectRatio}}
                  resizeMode="contain"
                />
              ) : null}

              <MediaControls
                enabled={!!controls || player.presentationMode === PresentationMode.fullscreen}
                aspectRatio={aspectRatio}
                currentTime={currentTime / 1000}
                mediaDuration={duration / 1000}
                isMuted={player.muted ?? false}
                isPaused={mediaStatus ? mediaStatus?.playerState === MediaPlayerState.PAUSED : !isPlaying}
                loading={isLoading}
                isBuffering={player.seeking && !player.paused}
                enableFullScreen={true}
                enableMute={false}
                seekerStart={(player.seekable[0]?.start ?? 1) / 1000}
                seekerEnd={(player.seekable[0]?.end ?? 1) / 1000}
                title={title}
                onPlayPausePress={_playPauseControl}
                onMutePress={() => {}}
                onFullScreenPress={_fullScreenControl}
                isFullScreen={player.presentationMode === PresentationMode.fullscreen}
                onSeekRequest={_seekControl}
                onSeekByRequest={_seekByControl}
                extraControls={[SubtitlesButton, LanguageButton]}
                isMini={isMini}
              />
            </View>
          ) : null}
        </>
      </THEOplayerView>

      {LanguageMenu}
      {SubtitlesMenu}
    </View>
  );
};

export default TheoMediaPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});
