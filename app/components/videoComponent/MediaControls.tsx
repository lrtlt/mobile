import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Insets,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import LiveBadge from '../liveBadge/LiveBadge';
import {
  IconFullscreen,
  IconPlayerForward,
  IconPlayerMute,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerRewind,
  IconPlayerVolume,
} from '../svg';
import TextComponent from '../text/Text';
import {CastButton} from 'react-native-google-cast';

const CONTROLS_TIMEOUT_MS = 3000;
const ICON_COLOR = '#FFFFFFDD';

const ICON_SIZE = 22;

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
  enabled: boolean;
  enableFullScreen: boolean;
  enableMute: boolean;
  mediaDuration: number;
  currentTime: number;
  title?: string;
  loading?: boolean;
  isBuffering?: boolean;

  isPaused: boolean;
  onPlayPausePress: () => void;

  isMuted: boolean;
  onMutePress: () => void;

  onFullScreenPress: () => void;

  onSeekRequest: (time: number) => void;
  onSeekByRequest: (time: number) => void;
}
const MediaControls: React.FC<Props> = ({
  enabled,
  enableFullScreen,
  enableMute,
  currentTime,
  mediaDuration,
  title,
  loading = false,
  isBuffering,
  isPaused,
  onPlayPausePress,
  isMuted,
  onMutePress,

  onFullScreenPress,

  onSeekRequest,
  onSeekByRequest,
}) => {
  const [visible, setVisible] = useState(enabled);
  const [scrubbing, setScrubbing] = useState(false);
  const [seekerPosition, setSeekerPosition] = useState(0);

  const seekPanResponder = useRef<PanResponderInstance>();
  const seekerWidth = useRef(0);

  const isLiveStream = mediaDuration <= 1;

  const resetControlsTimeout = useMemo(
    () =>
      debounce(() => {
        setVisible(false);
      }, CONTROLS_TIMEOUT_MS),
    [],
  );

  useEffect(() => {
    if (enabled) {
      resetControlsTimeout();
    }
  }, []);

  useEffect(() => {
    //Cleanup debounce on unmount
    return () => {
      resetControlsTimeout.cancel();
    };
  }, [resetControlsTimeout]);

  const setPosition = useCallback((position: number) => {
    const pos = Math.max(0, Math.min(seekerWidth.current, position));
    setSeekerPosition(pos);
    return pos;
  }, []);

  useEffect(() => {
    if (!scrubbing) {
      setPosition(seekerWidth.current * (currentTime / mediaDuration));
    }
  }, [currentTime, mediaDuration, scrubbing, setPosition]);

  seekPanResponder.current = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: (event, _gestureState) => {
        setPosition(event.nativeEvent.locationX);
        setScrubbing(true);
        resetControlsTimeout();
      },

      onPanResponderMove: (event, _gestureState) => {
        setPosition(event.nativeEvent.locationX);
        resetControlsTimeout();
      },

      onPanResponderRelease: (event, _gestureState) => {
        const newPosition = setPosition(event.nativeEvent.locationX);
        const newTime = mediaDuration * (newPosition / seekerWidth.current);
        onSeekRequest(newTime);
        resetControlsTimeout();

        setTimeout(() => {
          setScrubbing(false);
        }, 400);
      },
    });
  }, [mediaDuration, onSeekRequest, resetControlsTimeout, setPosition]);

  const handlePlayPauseToggle = useCallback(() => {
    onPlayPausePress();
    resetControlsTimeout();
  }, [onPlayPausePress, resetControlsTimeout]);

  const handleSeekBack = useCallback(() => {
    onSeekByRequest(-10);
    resetControlsTimeout();
  }, [onSeekByRequest, resetControlsTimeout]);

  const handleSeekForward = useCallback(() => {
    onSeekByRequest(10);
    resetControlsTimeout();
  }, [onSeekByRequest, resetControlsTimeout]);

  const handleMuteToggle = useCallback(() => {
    onMutePress();
    resetControlsTimeout();
  }, [onMutePress, resetControlsTimeout]);

  const handleFullscreenClick = useCallback(() => {
    onFullScreenPress();
    resetControlsTimeout();
  }, [onFullScreenPress, resetControlsTimeout]);

  const handleShowControls = useCallback(() => {
    setVisible(true);
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleHideControls = useCallback(() => {
    setVisible(false);
  }, []);

  const PlayPauseControl = useMemo(
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

  const CenterControls = useMemo(
    () => (
      <View style={styles.conterControlsRow}>
        {!isLiveStream && (
          <TouchableOpacity onPress={handleSeekBack} hitSlop={HIT_SLOP} activeOpacity={0.6}>
            <IconPlayerRewind style={styles.rewindIcon} size={ICON_SIZE + 12} color={ICON_COLOR} />
          </TouchableOpacity>
        )}
        {PlayPauseControl}
        {!isLiveStream && (
          <TouchableOpacity onPress={handleSeekForward} hitSlop={HIT_SLOP} activeOpacity={0.6}>
            <IconPlayerForward style={styles.forwardIcon} size={ICON_SIZE + 12} color={ICON_COLOR} />
          </TouchableOpacity>
        )}
      </View>
    ),
    [PlayPauseControl, handleSeekBack, handleSeekForward, isLiveStream],
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

  const FullScreenControl = useMemo(
    () => (
      <TouchableOpacity
        style={[styles.fullScreenIcon, styles.center]}
        onPress={handleFullscreenClick}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        <IconFullscreen size={ICON_SIZE - 6} color={ICON_COLOR} />
      </TouchableOpacity>
    ),
    [handleFullscreenClick],
  );

  const ChromeCastControl = <CastButton style={[styles.fullScreenIcon, styles.center]} tintColor="white" />;

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
      <View
        style={styles.seekBar_container}
        collapsable={false}
        {...seekPanResponder.current?.panHandlers}
        hitSlop={HIT_SLOP}>
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

  if (loading) {
    return (
      <View style={[styles.flex, styles.center]}>
        <ActivityIndicator size="large" animating={true} color="#FFF" />
      </View>
    );
  }

  const isOnStart = !isLiveStream && currentTime <= 1;
  const isEnding = !isLiveStream && mediaDuration - currentTime <= 1;
  const shouldBeVisible = enabled && (isOnStart || isEnding || visible);

  return shouldBeVisible ? (
    <Animated.View
      style={[styles.flex, styles.center]}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}>
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={['#000000FF', '#00000088', '#00000066', '#22222233']}
        useAngle={true}
        angle={0}
      />
      <Pressable style={{...StyleSheet.absoluteFillObject, bottom: ICON_SIZE}} onPress={handleHideControls} />
      <Title />
      {CenterControls}
      <View style={styles.bottomControlsContainer}>
        {!isLiveStream && (
          <View>
            {isBuffering && <ActivityIndicator style={styles.activityIndicator} size="small" color="white" />}
            <SeekBar position={seekerPosition} />
          </View>
        )}
        <View style={styles.bottomControlsRow}>
          {enableMute && <VolumeControl />}
          <View style={styles.progressContainer}>
            {!isLiveStream ? (
              <>
                <TimerControl time={formatTimeElapsed(currentTime ?? 0, mediaDuration)} />
                <TimerControl time={formatTimeTotal(mediaDuration ?? 0)} />
              </>
            ) : (
              <LiveBadge />
            )}
          </View>
          {ChromeCastControl}
          {enableFullScreen ? FullScreenControl : null}
        </View>
      </View>
    </Animated.View>
  ) : (
    <Pressable style={styles.flex} onPress={handleShowControls} />
  );
};

export default MediaControls;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 99,
    width: 44,
    height: 44,
    backgroundColor: '#00000088',
    alignSelf: 'center',
  },
  bottomControlsContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    padding: 4,
  },
  bottomControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    minHeight: ICON_SIZE + 8,
  },
  volumeIcon: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
  },
  fullScreenIcon: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
  },
  conterControlsRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewindIcon: {
    marginRight: 32,
  },
  forwardIcon: {
    marginLeft: 32,
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
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  seekBar_track: {
    borderRadius: 2,
    height: 5,
    overflow: 'hidden',
    backgroundColor: '#FFFFFFAA',
    width: '100%',
  },
  seekBar_fill: {
    backgroundColor: '#DD0000',
    height: 5,
  },
  activityIndicator: {
    alignSelf: 'flex-end',
    margin: 4,
  },
});

const formatTimeElapsed = (time: number, duration: number) => {
  time = Math.floor(Math.min(Math.max(time, 0), duration));
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatTimeTotal = (duration: number) => {
  const time = Math.max(duration, 0);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};
