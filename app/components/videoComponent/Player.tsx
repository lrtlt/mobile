import {debounce} from 'lodash';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Insets,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Video, {LoadError, OnLoadData, OnProgressData, OnSeekData} from 'react-native-video';
import {IconFullscreen, IconPlayerMute, IconPlayerPause, IconPlayerPlay, IconPlayerVolume} from '../svg';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import TextComponent from '../text/Text';
import LiveBadge from '../liveBadge/LiveBadge';

const CONTROLS_TIMEOUT_MS = 4000;
const ICON_COLOR = '#FFFFFFDD';
const SCRUBBER_TOLERANCE = 0;

const ICON_SIZE = 20;

/**
 * Hit slop size for controls
 */
const HIT_SLOP_SIZE = 4;

const HIT_SLOP: Insets = {
  top: HIT_SLOP_SIZE,
  bottom: HIT_SLOP_SIZE,
  left: HIT_SLOP_SIZE,
  right: HIT_SLOP_SIZE,
};

interface Props {
  style?: ViewStyle;
  uri: string;
  title?: string;
  autostart?: boolean;
  startTime?: number;
  poster?: string;
  onError?: (error: LoadError) => void;
}

const Player: React.FC<Props> = ({
  style,
  uri,
  autostart = true,
  title,
  poster,
  startTime,
  onError: _onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(!autostart);
  const [isUserPaused, setIsUserPaused] = useState(!autostart);
  const [isMuted, setIsMuted] = useState(false);

  const [scrubbing, setScrubbing] = useState(false);
  const [seekerPosition, setSeekerPosition] = useState(0);

  const videoRef = useRef<Video>(null);
  const seekPanResponder = useRef<PanResponderInstance>();
  const seekerWidth = useRef(0);

  const resetControlsTimeout = useMemo(
    () =>
      debounce(() => {
        setControlsVisible(false);
      }, CONTROLS_TIMEOUT_MS),
    [],
  );

  const seek = useMemo(
    () =>
      debounce((time) => {
        videoRef.current?.seek(time, SCRUBBER_TOLERANCE);
      }, 100),
    [],
  );

  const setPosition = (position: number) => {
    const newPosition = Math.max(0, Math.min(seekerWidth.current, position));
    setSeekerPosition(newPosition);
    return newPosition;
  };

  seekPanResponder.current = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (event, _gestureState) => {
      setPosition(event.nativeEvent.locationX);
      setScrubbing(true);
    },

    onPanResponderMove: (event, _gestureState) => {
      setPosition(event.nativeEvent.locationX);
      resetControlsTimeout();
    },

    onPanResponderRelease: (event, _gestureState) => {
      const newPosition = setPosition(event.nativeEvent.locationX);
      const newTime = duration * (newPosition / seekerWidth.current);
      seek(newTime);
      setIsPaused(isUserPaused);
      resetControlsTimeout();

      setTimeout(() => {
        setScrubbing(false);
      }, 400);
    },
  });

  const _onLoad = useCallback(
    (data: OnLoadData) => {
      setLoaded(true);
      setDuration(data.duration);
      setCurrentTime(data.currentTime);

      if (startTime) {
        videoRef.current?.seek(startTime, SCRUBBER_TOLERANCE);
      }
    },
    [startTime],
  );

  const _onLoadStart = useCallback(() => {
    setLoaded(false);
  }, []);

  const _onProgress = useCallback(
    (data: OnProgressData) => {
      if (duration <= 0) {
        //This is livestream
        return;
      }

      setCurrentTime(data.currentTime);
      if (!scrubbing) {
        setPosition(seekerWidth.current * (data.currentTime / duration));
      }
    },
    [duration, scrubbing],
  );

  const _onSeek = useCallback(
    (data: OnSeekData) => {
      setCurrentTime(data.seekTime);
      // Scrubbing ended while waiting for seek to finish
      if (!scrubbing) {
        setIsPaused(isUserPaused);
      }
    },
    [isUserPaused, scrubbing],
  );

  const _onEnd = useCallback(() => {
    setControlsVisible(true);
    setTimeout(() => {
      setIsPaused(true);
      setIsUserPaused(true);
      seek(0);
      setPosition(0);
    }, 1000);
  }, [seek]);

  const handlePlayPauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
    setIsUserPaused(!isUserPaused);
    resetControlsTimeout();
  }, [isPaused, isUserPaused, resetControlsTimeout]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
    resetControlsTimeout();
  }, [isMuted, resetControlsTimeout]);

  const handleFullscreenClick = useCallback(() => {
    videoRef?.current?.presentFullscreenPlayer();
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleShowControls = useCallback(() => {
    setControlsVisible(true);
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleHideControls = useCallback(() => {
    setControlsVisible(false);
  }, []);

  const PlayPauseControl = useCallback(
    () => (
      <TouchableOpacity
        style={styles.playPauseIcon}
        onPress={handlePlayPauseToggle}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        {isPaused ? (
          <IconPlayerPlay size={ICON_SIZE} color={ICON_COLOR} />
        ) : (
          <IconPlayerPause size={ICON_SIZE} color={ICON_COLOR} />
        )}
      </TouchableOpacity>
    ),
    [handlePlayPauseToggle, isPaused],
  );

  const VolumeControl = useCallback(
    () => (
      <TouchableOpacity
        style={[styles.volumeIcon, styles.center]}
        onPress={handleMuteToggle}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        {isMuted ? (
          <IconPlayerMute size={ICON_SIZE} color={ICON_COLOR} />
        ) : (
          <IconPlayerVolume size={ICON_SIZE} color={ICON_COLOR} />
        )}
      </TouchableOpacity>
    ),
    [handleMuteToggle, isMuted],
  );

  const FullScreenControl = useCallback(
    () => (
      <TouchableOpacity
        style={[styles.fullScreenIcon, styles.center]}
        onPress={handleFullscreenClick}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        <IconFullscreen size={ICON_SIZE - 8} color={ICON_COLOR} />
      </TouchableOpacity>
    ),
    [handleFullscreenClick],
  );

  const Title = useCallback(
    () => (
      <TextComponent
        style={styles.titleText}
        allowFontScaling={false}
        fontFamily="SourceSansPro-SemiBold"
        numberOfLines={2}>
        {title}
      </TextComponent>
    ),
    [title],
  );

  const TimerControl = useCallback(
    ({time}: {time: string}) => (
      <TextComponent style={styles.timerText} allowFontScaling={false} fontFamily="SourceSansPro-SemiBold">
        {time}
      </TextComponent>
    ),
    [],
  );

  const SeekBar = useCallback(({position}: {position: number}) => {
    return (
      <View style={styles.seekBar_container} collapsable={false} {...seekPanResponder.current?.panHandlers}>
        <View
          style={styles.seekBar_track}
          onLayout={(event) => (seekerWidth.current = event.nativeEvent.layout.width)}
          pointerEvents={'none'}>
          <View
            style={[
              styles.seekBar_fill,
              {
                width: position,
              },
            ]}
            pointerEvents={'none'}
          />
        </View>
      </View>
    );
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        style={styles.video}
        resizeMode="contain"
        paused={isPaused}
        audioOnly={false}
        fullscreen={false}
        fullscreenAutorotate={true}
        fullscreenOrientation="all"
        poster={poster}
        posterResizeMode="cover"
        controls={false}
        muted={isMuted}
        rate={1.0}
        playInBackground={true}
        playWhenInactive={true}
        onLoadStart={_onLoadStart}
        onProgress={_onProgress}
        onError={_onError}
        onLoad={_onLoad}
        onSeek={_onSeek}
        onEnd={_onEnd}
        progressUpdateInterval={200}
        ignoreSilentSwitch={'ignore'}
        automaticallyWaitsToMinimizeStalling={false}
        source={{
          uri: uri,
        }}
      />
      {loaded && controlsVisible ? (
        <Animated.View
          style={[styles.flex, styles.center]}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}>
          <LinearGradient
            style={StyleSheet.absoluteFillObject}
            colors={['#000000', '#22222299', '#22222299', '#22222244']}
            useAngle={true}
            angle={0}
          />
          <Pressable style={{...StyleSheet.absoluteFillObject}} onPress={handleHideControls} />
          <Title />
          <PlayPauseControl />
          <View style={styles.bottomControlsContainer}>
            <VolumeControl />
            <View style={styles.progressContainer}>
              {duration > 0 ? (
                <>
                  <TimerControl time={formatTimeElapsed(currentTime, duration)} />
                  <SeekBar position={seekerPosition} />
                  <TimerControl time={formatTimeRemaining(currentTime, duration)} />
                </>
              ) : (
                <LiveBadge />
              )}
            </View>

            <FullScreenControl />
          </View>
        </Animated.View>
      ) : (
        <Pressable style={styles.flex} onPress={handleShowControls} />
      )}
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  playPauseIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 99,
    backgroundColor: '#00000088',
    alignSelf: 'center',
  },
  bottomControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    padding: 4,
  },
  volumeIcon: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
  },
  fullScreenIcon: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  timerText: {
    flexGrow: 0,
    fontSize: 13,
    color: ICON_COLOR,
    letterSpacing: 0.8,
  },
  titleText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 8,
    textShadowColor: '#000000AA',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    fontSize: 16,
    color: 'white',
  },
  seekBar_container: {
    height: 22,
    flexGrow: 1,
    justifyContent: 'center',
    marginHorizontal: 8,
    top: 1,
  },
  seekBar_track: {
    borderRadius: 2,
    height: 3,
    overflow: 'hidden',
    backgroundColor: '#999999AA',
    width: '100%',
  },
  seekBar_fill: {
    backgroundColor: '#FFFFFFFF',
    height: 3,
  },
});

const formatTimeElapsed = (time: number, duration: number) => {
  time = Math.min(Math.max(time, 0), duration);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatTimeRemaining = (time: number, duration: number) => {
  time = Math.abs(Math.min(Math.max(time, 0), duration) - duration);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `-${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};
