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

interface Props {
  style?: ViewStyle;
  uri: string;
  mode?: 'playerDefault' | 'playerFullscreen';
  title?: string;
  autostart?: boolean;
  startTime?: number;
  poster?: string;
  onError?: (error: LoadError) => void;
}

const MediaPlayerWithControls: React.FC<Props> = ({
  style,
  uri,
  mode = 'playerDefault',
  autostart = true,
  title,
  poster,
  startTime,
  onError: _onError,
}) => {
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(!autostart);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isActive, setActive] = useState(true);

  const [, setCurrentTimeInternal] = useState(0);

  const videoRef = useRef<Video>(null);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleOnBlurEffect, []);

  try {
    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    navigation.addListener('beforeRemove', () => {
      setActive(false);
      setIsPaused(true);
    });
  } catch (_) {}

  try {
    useFocusEffect(handleOnBlurEffect);
  } catch (_) {}
  /***************************************************************/
  /***************************************************************/

  const {
    setCurrentTime,
    getCurrentTime,
    isFullScreen,
    setIsFullScreen,
    setVideoBaseData,
    registerFullScreenListener,
    unregisterFullScreenListener,
  } = useVideo();

  const {trackPlay, trackPause, trackBuffer, trackClose, trackComplete, trackSeek} = useMediaTracking();

  useEffect(() => {
    return () => {
      if (mode === 'playerDefault') {
        trackClose(uri, getCurrentTime());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seek = useMemo(
    () =>
      debounce((time) => {
        videoRef.current?.seek(time, SCRUBBER_TOLERANCE);
      }, 100),
    [],
  );

  const setBufferingDebounce = useMemo(
    () =>
      debounce((buffering: boolean) => {
        if (buffering) {
          trackBuffer(uri, getCurrentTime());
        } else {
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
        if (mode === 'playerDefault') {
          setIsPaused(true);
        }
      },
      onFullScreenExit: () => {
        if (mode === 'playerDefault') {
          seek(duration > 1 ? getCurrentTime() : Number.MAX_SAFE_INTEGER);
          setIsPaused(false);
        }
      },
    });
    return () => unregisterFullScreenListener(key);
  }, [duration, getCurrentTime, mode, registerFullScreenListener, seek, unregisterFullScreenListener]);

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

      if (startTime) {
        videoRef.current?.seek(startTime, SCRUBBER_TOLERANCE);
      }

      if (isPaused) {
        trackPause(uri, getCurrentTime());
      } else {
        trackPlay(uri, getCurrentTime());
      }
    },
    [
      getCurrentTime,
      isPaused,
      poster,
      setCurrentTime,
      setVideoBaseData,
      startTime,
      title,
      trackPause,
      trackPlay,
      uri,
    ],
  );

  const _onLoadStart = useCallback(() => {
    setIsLoaded(false);
  }, []);

  const _onProgress = useCallback(
    (data: OnProgressData) => {
      if (duration <= 0) {
        return;
      }
      setCurrentTimeInternal(data.currentTime);
      setCurrentTime(data.currentTime);
      if (isBuffering) {
        setBufferingDebounce(false);
      }
    },
    [duration, isBuffering, setBufferingDebounce, setCurrentTime],
  );

  const _onSeek = useCallback(
    (data: OnSeekData) => {
      setCurrentTime(Math.min(data.seekTime, duration));
      setBufferingDebounce(false);
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
    trackPause(uri, getCurrentTime());
  }, [getCurrentTime, trackPause, uri]);

  const _onEnd = useCallback(() => {
    trackComplete(uri, getCurrentTime());
    setTimeout(() => {
      setIsPaused(true);
      trackPause(uri, getCurrentTime());
      seek(0);
      trackSeek(uri, 0);
    }, 1000);
  }, [getCurrentTime, seek, trackComplete, trackPause, trackSeek, uri]);

  const handlePlayPauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
    if (isPaused) {
      trackPlay(uri, getCurrentTime());
    } else {
      trackPause(uri, getCurrentTime());
    }
  }, [getCurrentTime, isPaused, trackPause, trackPlay, uri]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleFullscreenClick = useCallback(() => {
    // videoRef?.current?.presentFullscreenPlayer();
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen, setIsFullScreen]);

  const handleOnSeekRequest = useCallback(
    (time) => {
      trackSeek(uri, getCurrentTime());
      seek(time);
      setCurrentTime(time);
      setCurrentTimeInternal(time);
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
            progressUpdateInterval={300}
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
              isMuted={isMuted}
              isPaused={isPaused}
              loading={!isLoaded}
              isBuffering={isBuffering}
              title={title}
              onPlayPausePress={handlePlayPauseToggle}
              onMutePress={handleMuteToggle}
              onFullScreenPress={handleFullscreenClick}
              onSeekRequest={handleOnSeekRequest}
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
