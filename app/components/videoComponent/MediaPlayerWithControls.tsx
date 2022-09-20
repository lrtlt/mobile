import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Video, {LoadError, OnBufferData, OnLoadData, OnProgressData, OnSeekData} from 'react-native-video';
import MediaControls from './MediaControls';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import useMediaTracking from './useMediaTracking';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {MainStackParamList} from '../../navigation/MainStack';
import Gemius from 'react-native-gemius-plugin';

const SCRUBBER_TOLERANCE = 0;

// eslint-disable-next-line no-shadow
export enum PlayerMode {
  DEFAULT,
  FULLSCREEN,
}

// eslint-disable-next-line no-shadow
export enum MediaType {
  VIDEO,
  AUDIO,
}

interface Props {
  style?: ViewStyle;
  uri: string;
  mode?: PlayerMode;
  mediaType: MediaType;
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
  mediaType,
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
  // const [isActive, setActive] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [, tick] = useState(startTime ?? 0);

  const currentTimeRef = useRef(startTime ?? 0);

  const setCurrentTime = useCallback((time: number) => {
    currentTimeRef.current = time;
    tick(time);
  }, []);

  const videoRef = useRef<Video>(null);

  const {trackPlay, trackPause, trackBuffer, trackClose, trackComplete, trackSeek} = useMediaTracking();

  /***************************************************************/
  /** HANDLE IOS react-navigation back behaviour *****************/
  /***************************************************************/

  // const handleOnBlurEffect = useCallback(() => {
  //   setActive(true);
  //   return () => {
  //     setActive(false);
  //     setIsPaused(true);
  //   };
  // }, []);

  // try {
  //   const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   useEffect(() => {
  //     const subscription = navigation.addListener('beforeRemove', () => {
  //       setActive(false);
  //       setIsPaused(true);
  //     });
  //     return subscription;
  //   }, [navigation]);
  // } catch (_) {}

  // try {
  //   useFocusEffect(handleOnBlurEffect);
  // } catch (_) {}
  /***************************************************************/
  /***************************************************************/

  useEffect(() => {
    return () => {
      trackClose(uri, currentTimeRef.current);
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
      debounce(
        (buffering: boolean) => {
          if (buffering) {
            trackBuffer(uri, currentTimeRef.current);
          } else {
            // //Dont track initial buffer
            if (currentTimeRef.current > 1) {
              trackPlay(uri, currentTimeRef.current);
            }
          }
          setIsBuffering(buffering);
        },
        200,
        {
          leading: true,
          trailing: false,
        },
      ),
    [trackBuffer, trackPlay, uri],
  );

  const _onLoad = useCallback(
    (data: OnLoadData) => {
      Gemius.setProgramData(uri, title ?? '', data.duration, mediaType === MediaType.VIDEO);
      setIsLoaded(true);
      setDuration(data.duration);

      const time = Math.min(data.currentTime, data.duration);
      setCurrentTime(time);

      if (startTime && data.duration > 1) {
        videoRef.current?.seek(startTime, SCRUBBER_TOLERANCE);
      }

      if (!isPaused) {
        trackPlay(uri, time);
      }
    },
    [isPaused, mediaType, setCurrentTime, startTime, title, trackPlay, uri],
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
    [setCurrentTime, duration, setBufferingDebounce],
  );

  const _onBuffer = useCallback(
    (data: OnBufferData) => {
      setBufferingDebounce(data?.isBuffering ?? false);
    },
    [setBufferingDebounce],
  );

  const _onAudioBecomingNoisy = () => {
    setIsPaused(true);
    trackPause(uri, currentTimeRef.current);
  };

  const _onEnd = useCallback(() => {
    trackComplete(uri, duration);
    setTimeout(() => {
      setIsPaused(true);
      trackPause(uri, duration);
      seek(0);
      trackSeek(uri, 0);
    }, 1000);
  }, [duration, seek, trackComplete, trackPause, trackSeek, uri]);

  const handlePlayPauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
    if (isPaused) {
      trackPlay(uri, currentTimeRef.current);
    } else {
      trackPause(uri, currentTimeRef.current);
    }
  }, [isPaused, trackPause, trackPlay, uri]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted, setIsMuted]);

  const handleFullscreenClick = useCallback(() => {
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen, setIsFullScreen]);

  const handleOnSeekRequest = useCallback(
    (time) => {
      trackSeek(uri, time);
      seek(time);
      setCurrentTime(time);
    },
    [seek, setCurrentTime, trackSeek, uri],
  );

  const handleOnSeekByRequest = useCallback(
    (seekByTime: number) => {
      const newTime = currentTimeRef.current + seekByTime;
      trackSeek(uri, newTime);
      seek(newTime);
      setCurrentTime(newTime);
    },
    [seek, setCurrentTime, trackSeek, uri],
  );

  return (
    <View style={[styles.container, style]}>
      <>
        <Video
          ref={videoRef}
          style={styles.video}
          resizeMode="contain"
          paused={isPaused}
          muted={isMuted}
          poster={poster ?? VIDEO_DEFAULT_BACKGROUND_IMAGE}
          audioOnly={false}
          fullscreen={isFullScreen}
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
        {isLoaded ? (
          <MediaControls
            enabled={true}
            currentTime={currentTimeRef.current}
            mediaDuration={duration}
            isFullScreen={isFullScreen}
            isMuted={isMuted}
            isPaused={isPaused}
            isLoading={!isLoaded}
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
