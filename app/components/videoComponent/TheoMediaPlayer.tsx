import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {
  PlayerConfiguration,
  SourceDescription,
  THEOplayerView,
  ErrorEvent,
  THEOplayer,
  PlayerEventType,
  Event,
  AspectRatio,
  PresentationMode,
  AudioSessionMode,
} from 'react-native-theoplayer';
import MediaControls from './ui/MediaControls';
import {useMediaPlayer} from './context/useMediaPlayer';
import {MediaType} from './context/PlayerContext';
import usePlayerTracking from './usePlayerTracking';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import usePlayerLanguage from './ui/extra/usePlayerLanguage';
import {VideoTextTrack} from '../../api/Types';
import {useSettingsStore} from '../../state/settings_store';
import {log, getCrashlytics} from '@react-native-firebase/crashlytics';
import Config from 'react-native-config';
import usePlayerOrientationChange from './usePlayerOrientationChange';
import {PlayerContextProvider} from './context/player/PlayerContextProvider';
import usePlayerBackListener from './usePlayerBackListener';
import usePlayerSubtitles from './ui/extra/usePlayerSubtitles';
import Poster from './ui/components/Poster';
import usePlayerLoop from './usePlayerLoop';

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
  controls?: boolean;
  loop?: boolean;
  aspectRatio?: number;
  backgroundAudioEnabled?: boolean;
  tracks?: VideoTextTrack[];
  onError?: (e?: any) => void;
  onEnded?: () => void;
  onPlayerReadyCallback?: (player: THEOplayer) => void;
}

const config: PlayerConfiguration = {
  license: Config.THEO_PLAYER_LICENCE,
  cast: {
    chromecast: {
      appID: '87169DE4',
    },
  },
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
      // src: 'https://livesim.dashif.org/livesim/chunkdur_1/ato_7/testpic4_8s/Manifest.mpd',
      // type: 'application/dash+xml',
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
  //   //## Not working
  //   // {
  //   //   default: true,
  //   //   kind: 'subtitles',
  //   //   label: 'Subtitrai',
  //   //   src: 'https://www.lrt.lt/media/VIDEO/2024-11/LAI90147_8a8b3d71-36a8-4bdb-9490-528ae870692a.txt',
  //   //   srclang: 'lt',
  //   // },
  // ],
  textTracks: tracks,
});

const TheoMediaPlayer: React.FC<React.PropsWithChildren<Props>> = ({
  streamUri,
  mediaType = MediaType.VIDEO,
  title,
  poster = VIDEO_DEFAULT_BACKGROUND_IMAGE,
  autoStart,
  isLiveStream,
  startTime,
  tracks,
  isMini = false,
  loop = false,
  minifyEnabled = true,
  controls = true,
  aspectRatio = 16 / 9,
  backgroundAudioEnabled = true,
  onError,
  onEnded,
  onPlayerReadyCallback,
}) => {
  const [player, setPlayer] = useState<THEOplayer>();
  const [isLoading, setIsLoading] = useState(true);

  // Set up analytics tracking
  usePlayerTracking({player, streamUri, startTime});

  // Set up back button handler
  usePlayerBackListener({player});

  // Set up looping
  usePlayerLoop({player, loop});

  // Handle orientation changes
  usePlayerOrientationChange({player});

  const {colors} = useTheme();
  const isContinuousPlayEnabled = useSettingsStore((state) => state.isContinuousPlayEnabled);

  const {setMediaData, close} = useMediaPlayer();

  //Close isMini player before loading new one
  useEffect(() => {
    if (!isMini) {
      log(getCrashlytics(), 'TheoMediaPlayer: Close mini player, because new player is loading');
      close();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (player) {
        const isPlaying = !player.paused && !player.seeking;

        if (isContinuousPlayEnabled && isPlaying && !isMini && minifyEnabled) {
          log(getCrashlytics(), 'TheoMediaPlayer: Saving media data for continuous play');
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
      }
    };
  }, [player, isContinuousPlayEnabled, isMini, minifyEnabled, setMediaData]);

  const onLoadedDataHandler = useCallback(
    (player: THEOplayer) => (_: Event<PlayerEventType.LOADED_DATA>) => {
      const duration = player.duration === Infinity ? 0 : player.duration;
      Gemius.setProgramData(streamUri, title ?? '', duration, mediaType === MediaType.VIDEO);
      setIsLoading(false);
    },
    [streamUri, title, mediaType],
  );

  const onErrorHandler = useCallback(
    (e: ErrorEvent) => {
      log(getCrashlytics(), 'TheoMediaPlayer: Player error: ' + JSON.stringify(e));
      console.log('Player error:', e);
      onError?.();
    },
    [onError],
  );

  const onEndedHandler = useCallback(
    (e: Event<PlayerEventType.ENDED>) => {
      log(getCrashlytics(), 'TheoMediaPlayer: Player ended: ' + JSON.stringify(e));

      if (onEnded) {
        onEnded();
      }
    },
    [onEnded],
  );

  const onPlayerReady = (player: THEOplayer) => {
    log(getCrashlytics(), 'TheoMediaPlayer: Player ready');
    Gemius.setProgramData(streamUri, title ?? '', 0, mediaType === MediaType.VIDEO);
    setPlayer(player);

    player.addEventListener(PlayerEventType.LOADED_DATA, onLoadedDataHandler(player));
    player.addEventListener(PlayerEventType.ERROR, onErrorHandler);
    player.addEventListener(PlayerEventType.ENDED, onEndedHandler);

    player.backgroundAudioConfiguration = {
      enabled: backgroundAudioEnabled,
      shouldResumeAfterInterruption: true,
      stopOnBackground: false,
      audioSessionMode: AudioSessionMode.SPOKEN_AUDIO,
    };
    player.autoplay = autoStart;
    player.preload = 'auto';
    player.muted = false;
    player.pipConfiguration = {
      //TODO: enable on android after the fix on TheoPlayer side
      startsAutomatically: backgroundAudioEnabled && Platform.OS === 'ios',
    };
    player.aspectRatio = AspectRatio.FIT;
    onPlayerReadyCallback?.(player);
  };

  useEffect(() => {
    if (player && streamUri) {
      player.source = makeSource(streamUri, title, poster, tracks);
      if (!isLiveStream) {
        player.currentTime = startTime ? startTime * 1000 : 0;
      }
    }
  }, [player, streamUri, startTime, isLiveStream, title, poster, tracks]);

  const {LanguageButton, LanguageMenu} = usePlayerLanguage({player: player});
  const {SubtitlesButton, SubtitlesMenu} = usePlayerSubtitles({player: player});

  return (
    <PlayerContextProvider
      player={player}
      streamUri={streamUri}
      isLiveStream={isLiveStream}
      mediaType={mediaType}
      title={title}
      poster={poster}
      controlsEnabled={!!controls || player?.presentationMode === PresentationMode.fullscreen}>
      <View style={{...styles.container, aspectRatio}}>
        <THEOplayerView style={styles.video} config={config} onPlayerReady={onPlayerReady}>
          <>
            {isLoading && (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" animating={isLoading} color={colors.playerIcons} />
              </View>
            )}
            {!isLoading && player ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {mediaType == MediaType.AUDIO && <Poster posterUri={poster} />}
                <MediaControls
                  enabled={!!controls || player.presentationMode === PresentationMode.fullscreen}
                  aspectRatio={aspectRatio}
                  title={title}
                  enableFullScreen={true}
                  enableMute={false}
                  extraControls={[SubtitlesButton, LanguageButton]}
                />
              </View>
            ) : null}
            {SubtitlesMenu}
            {LanguageMenu}
          </>
        </THEOplayerView>
      </View>
    </PlayerContextProvider>
  );
};

export default TheoMediaPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    ...StyleSheet.absoluteFill,
  },
});
