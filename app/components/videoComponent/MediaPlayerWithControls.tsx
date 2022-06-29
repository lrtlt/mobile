import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Video, {LoadError, OnBufferData, OnLoadData, OnProgressData, OnSeekData} from 'react-native-video';
import {useVideo} from './context/useVideo';
import MediaControls from './MediaControls';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import useMediaTracking from './useMediaTracking';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';

const SCRUBBER_TOLERANCE = 0;

// eslint-disable-next-line no-shadow
export enum PlayerMode {
  DEFAULT,
  FULLSCREEN,
}

interface Props {
  style?: ViewStyle;
  uri: string;
  mode?: PlayerMode;
  title?: string;
  autostart?: boolean;
  startTime?: number;
  poster?: string;
  enableFullScreen?: boolean;
  onError?: (error: LoadError) => void;
}

const MediaPlayerWithControls: React.FC<Props> = ({
  style,
  uri,
  mode = PlayerMode.DEFAULT,
  autostart = true,
  title,
  poster,
  startTime,
  onError: _onError,
  enableFullScreen = true,
}) => {
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(!autostart);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isActive, setActive] = useState(true);

  const [, setCurrentTimeInternal] = useState(0);

  const videoRef = useRef<Video>(null);

  const {
    setCurrentTime,
    getCurrentTime,

    isPausedByUser,
    setIsPausedByUser,

    isFullScreen,
    setIsFullScreen,

    isMuted,
    setIsMuted,

    setVideoBaseData,
    registerFullScreenListener,
    unregisterFullScreenListener,
  } = useVideo();

  const {trackPlay, trackPause, trackBuffer, trackClose, trackComplete, trackSeek} = useMediaTracking();

  /***************************************************************/
  /** HANDLE IOS react-navigation back behaviour *****************/
  /***************************************************************/

  const handleOnBlurEffect = useCallback(() => {
    setActive(true);
    return () => {
      setActive(false);
      setIsPaused(true);
    };
  }, []);

  try {
    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const subscription = navigation.addListener('beforeRemove', () => {
        setActive(false);
        setIsPaused(true);
      });
      return subscription;
    }, [navigation]);
  } catch (_) {}

  try {
    useFocusEffect(handleOnBlurEffect);
  } catch (_) {}
  /***************************************************************/
  /***************************************************************/

  useEffect(() => {
    return () => {
      if (mode === PlayerMode.DEFAULT) {
        trackClose(uri, getCurrentTime());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seek = useMemo(
    () =>
      debounce((time) => {
        setIsSeeking(true);
        videoRef.current?.seek(Math.max(time, 0), SCRUBBER_TOLERANCE);
      }, 100),
    [],
  );

  const setBufferingDebounce = useMemo(
    () =>
      debounce((buffering: boolean) => {
        if (buffering) {
          trackBuffer(uri, getCurrentTime());
        } else {
          //Dont track initial buffer
          if (getCurrentTime() > 1) {
            trackPlay(uri, getCurrentTime());
          }
        }

        setIsBuffering(buffering);
      }, 100),
    [getCurrentTime, trackBuffer, trackPlay, uri],
  );

  useEffect(() => {
    const key = `${mode}-${Math.random() * Math.pow(10, 8)}`;

    registerFullScreenListener(key, {
      onFullScreenEnter: () => {
        if (mode === PlayerMode.DEFAULT) {
          setIsPaused(true);
        }
      },
      onFullScreenExit: () => {
        if (mode === PlayerMode.DEFAULT) {
          seek(duration > 1 ? getCurrentTime() : Number.MAX_SAFE_INTEGER);
          setIsPaused(isPausedByUser ?? false);
        }
      },
    });
    return () => unregisterFullScreenListener(key);
  }, [
    duration,
    getCurrentTime,
    isPausedByUser,
    mode,
    registerFullScreenListener,
    seek,
    unregisterFullScreenListener,
  ]);

  const _onLoad = useCallback(
    (data: OnLoadData) => {
      setIsLoaded(true);
      setDuration(data.duration);
      setCurrentTime(Math.min(data.currentTime, data.duration));

      setVideoBaseData({
        poster,
        title,
        uri,
      });

      setIsPausedByUser(isPaused);

      if (startTime && data.duration > 1) {
        videoRef.current?.seek(startTime, SCRUBBER_TOLERANCE);
      }

      if (!isPaused) {
        trackPlay(uri, getCurrentTime());
      }
    },
    [
      getCurrentTime,
      isPaused,
      poster,
      setCurrentTime,
      setIsPausedByUser,
      setVideoBaseData,
      startTime,
      title,
      trackPlay,
      uri,
    ],
  );

  const _onLoadStart = useCallback(() => {
    setIsLoaded(false);
  }, []);

  const _onProgress = useCallback(
    (data: OnProgressData) => {
      if (duration <= 0 && isSeeking) {
        return;
      }
      setCurrentTime(data.currentTime);
      setCurrentTimeInternal(data.currentTime);

      if (isBuffering) {
        setBufferingDebounce(false);
      }
    },
    [duration, isBuffering, isSeeking, setBufferingDebounce, setCurrentTime],
  );

  const _onSeek = useCallback(
    (data: OnSeekData) => {
      setCurrentTime(Math.min(data.seekTime, duration));
      setBufferingDebounce(false);
      setIsSeeking(false);
    },
    [setBufferingDebounce, setCurrentTime, duration],
  );

  const _onBuffer = useCallback(
    (data: OnBufferData) => {
      setBufferingDebounce(data?.isBuffering ?? false);
    },
    [setBufferingDebounce],
  );

  const _onAudioBecomingNoisy = useCallback(() => {
    setIsPaused(true);
    setIsPausedByUser(true);
    trackPause(uri, getCurrentTime());
  }, [getCurrentTime, setIsPausedByUser, trackPause, uri]);

  const _onEnd = useCallback(() => {
    trackComplete(uri, getCurrentTime());
    setTimeout(() => {
      setIsPaused(true);
      setIsPausedByUser(true);
      trackPause(uri, getCurrentTime());
      seek(0);
      trackSeek(uri, 0);
    }, 1000);
  }, [getCurrentTime, seek, setIsPausedByUser, trackComplete, trackPause, trackSeek, uri]);

  const handlePlayPauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
    setIsPausedByUser(!isPaused);
    if (isPaused) {
      trackPlay(uri, getCurrentTime());
    } else {
      trackPause(uri, getCurrentTime());
    }
  }, [getCurrentTime, isPaused, setIsPausedByUser, trackPause, trackPlay, uri]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted, setIsMuted]);

  const handleFullscreenClick = useCallback(() => {
    // videoRef?.current?.presentFullscreenPlayer();
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen, setIsFullScreen]);

  const handleOnSeekRequest = useCallback(
    (time) => {
      trackSeek(uri, time);
      seek(time);
      setCurrentTime(time);
      setCurrentTimeInternal(time);
    },
    [seek, setCurrentTime, trackSeek, uri],
  );

  const handleOnSeekByRequest = useCallback(
    (seekByTime) => {
      const newTime = getCurrentTime() + seekByTime;
      trackSeek(uri, newTime);
      seek(newTime);
      setCurrentTime(newTime);
      setCurrentTimeInternal(newTime);
    },
    [getCurrentTime, seek, setCurrentTime, trackSeek, uri],
  );

  return (
    <View style={[styles.container, style]}>
      {isActive && (
        <>
          <Video
            ref={videoRef}
            style={styles.video}
            resizeMode="contain"
            paused={isPaused}
            muted={isMuted}
            poster={poster ?? VIDEO_DEFAULT_BACKGROUND_IMAGE}
            audioOnly={false}
            fullscreen={false}
            fullscreenAutorotate={false}
            posterResizeMode="cover"
            controls={false}
            rate={1.0}
            playInBackground={true}
            playWhenInactive={true}
            onLoadStart={_onLoadStart}
            onProgress={_onProgress}
            onError={_onError}
            onLoad={_onLoad}
            onSeek={_onSeek}
            onEnd={_onEnd}
            onBuffer={_onBuffer}
            onAudioBecomingNoisy={_onAudioBecomingNoisy}
            progressUpdateInterval={200}
            ignoreSilentSwitch={'ignore'}
            automaticallyWaitsToMinimizeStalling={true}
            source={{
              uri: uri,
            }}
          />
          {isLoaded === true ? (
            <MediaControls
              enabled={true}
              currentTime={getCurrentTime()}
              mediaDuration={duration}
              isFullScreen={isFullScreen ?? false}
              isMuted={isMuted ?? false}
              isPaused={isPaused}
              loading={!isLoaded}
              isBuffering={isBuffering}
              enableFullScreen={enableFullScreen}
              title={title}
              onPlayPausePress={handlePlayPauseToggle}
              onMutePress={handleMuteToggle}
              onFullScreenPress={handleFullscreenClick}
              onSeekRequest={handleOnSeekRequest}
              onSeekByRequest={handleOnSeekByRequest}
            />
          ) : null}
        </>
      )}
    </View>
  );
};

export default MediaPlayerWithControls;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});
