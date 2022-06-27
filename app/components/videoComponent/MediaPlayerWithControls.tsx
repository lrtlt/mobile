/* eslint-disable react-hooks/exhaustive-deps */
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Video, {LoadError, OnBufferData, OnLoadData, OnProgressData, OnSeekData} from 'react-native-video';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {useVideo} from './context/useVideo';
import MediaControls from './MediaControls';
import {useFocusEffect} from '@react-navigation/native';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import useMediaTracking from './useMediaTracking';

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

  const [, setCurrentTimeInternal] = useState(0);

  const videoRef = useRef<Video>(null);

  const handleOnBlurEffect = useCallback(() => {
    return () => {
      setIsPaused(true);
    };
  }, []);

  try {
    useFocusEffect(handleOnBlurEffect);
  } catch (_error) {
    //Error: Couldn't find a navigation object. Is your component inside NavigationContainer?
  }

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
    [],
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
          seek(duration <= 1 ? -1 : getCurrentTime());
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
      setCurrentTime(data.currentTime);

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
    [poster, setCurrentTime, setVideoBaseData, startTime, title, uri],
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
      setCurrentTime(data.seekTime);
      setBufferingDebounce(false);
    },
    [setBufferingDebounce, setCurrentTime],
  );

  const _onBuffer = useCallback(
    (data: OnBufferData) => {
      setBufferingDebounce(data?.isBuffering ?? false);
    },
    [setBufferingDebounce],
  );

  const _onEnd = useCallback(() => {
    trackComplete(uri, getCurrentTime());
    setTimeout(() => {
      setIsPaused(true);
      trackPause(uri, getCurrentTime());
      seek(0);
      trackSeek(uri, 0);
    }, 1000);
  }, [getCurrentTime, seek, trackComplete]);

  const handlePlayPauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
    if (isPaused) {
      trackPlay(uri, getCurrentTime());
    } else {
      trackPause(uri, getCurrentTime());
    }
  }, [isPaused]);

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
    [seek, setCurrentTime],
  );

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        style={styles.video}
        resizeMode="contain"
        paused={isPaused}
        muted={isMuted}
        poster={poster ?? VIDEO_DEFAULT_BACKGROUND_IMAGE}
        audioOnly={false}
        fullscreen={false}
        fullscreenAutorotate={true}
        fullscreenOrientation="all"
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
        progressUpdateInterval={300}
        ignoreSilentSwitch={'ignore'}
        automaticallyWaitsToMinimizeStalling={false}
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
    </View>
  );
};

export default React.memo(MediaPlayerWithControls, (prev, next) => {
  return checkEqual(prev, next);
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});
