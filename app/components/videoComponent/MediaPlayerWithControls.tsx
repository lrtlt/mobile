import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Video, {LoadError, OnLoadData, OnProgressData, OnSeekData} from 'react-native-video';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {useVideo} from './context/useVideo';
import MediaControls from './MediaControls';
import {useFocusEffect} from '@react-navigation/native';

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
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(!autostart);
  const [isMuted, setIsMuted] = useState(false);
  const [, setCurrentTimeInternal] = useState(0);

  const videoRef = useRef<Video>(null);

  const handleOnBlurEffect = useCallback(() => {
    return () => setIsPaused(true);
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

  const seek = useMemo(
    () =>
      debounce((time) => {
        videoRef.current?.seek(time, SCRUBBER_TOLERANCE);
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
          seek(duration <= 1 ? 1 : getCurrentTime());
          setIsPaused(false);
        }
      },
    });
    return () => unregisterFullScreenListener(key);
  }, [duration, getCurrentTime, mode, registerFullScreenListener, seek, unregisterFullScreenListener]);

  const _onLoad = useCallback(
    (data: OnLoadData) => {
      setLoaded(true);
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
    },
    [poster, setCurrentTime, setVideoBaseData, startTime, title, uri],
  );

  const _onLoadStart = useCallback(() => {
    setLoaded(false);
  }, []);

  const _onProgress = useCallback(
    (data: OnProgressData) => {
      if (duration <= 0) {
        return;
      }
      setCurrentTimeInternal(data.currentTime);
      setCurrentTime(data.currentTime);
    },
    [duration, setCurrentTime],
  );

  const _onSeek = useCallback(
    (data: OnSeekData) => {
      setCurrentTime(data.seekTime);
    },
    [setCurrentTime],
  );

  const _onEnd = useCallback(() => {
    setTimeout(() => {
      setIsPaused(true);
      seek(0);
    }, 1000);
  }, [seek]);

  const handlePlayPauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
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
        poster={poster}
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
        progressUpdateInterval={300}
        ignoreSilentSwitch={'ignore'}
        automaticallyWaitsToMinimizeStalling={false}
        source={{
          uri: uri,
        }}
      />
      {loaded === true ? (
        <MediaControls
          enabled={true}
          currentTime={getCurrentTime()}
          mediaDuration={duration}
          isFullScreen={isFullScreen ?? false}
          isMuted={isMuted}
          isPaused={isPaused}
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
