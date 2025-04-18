import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Insets,
  PanResponder,
  PanResponderInstance,
  Platform,
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
  IconPlayerPauseV2,
  IconPlayerPlayV2,
  IconPlayerRewind,
  IconPlayerVolume,
} from '../svg';
import TextComponent from '../text/Text';
import {CastButton} from 'react-native-google-cast';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {useTheme} from '../../Theme';

const CONTROLS_TIMEOUT_MS = 2500;

export const ICON_COLOR = '#FFFFFFDD';
export const ICON_SIZE = 22;

/**
 * Hit slop size for controls
 */
const HIT_SLOP_SIZE = 4;

export const HIT_SLOP: Insets = {
  top: HIT_SLOP_SIZE,
  bottom: HIT_SLOP_SIZE,
  left: HIT_SLOP_SIZE,
  right: HIT_SLOP_SIZE,
};

export const HIT_SLOP_BIG: Insets = {
  top: HIT_SLOP_SIZE * 4,
  bottom: HIT_SLOP_SIZE * 4,
  left: HIT_SLOP_SIZE * 4,
  right: HIT_SLOP_SIZE * 4,
};

interface Props {
  enabled: boolean;
  enableFullScreen: boolean;
  isFullScreen: boolean;
  enableMute: boolean;
  mediaDuration: number;
  currentTime: number;
  title?: string;
  loading?: boolean;
  seekerStart: number;
  seekerEnd: number;
  isBuffering?: boolean;
  isMini?: boolean;
  extraControls?: React.JSX.Element[];
  aspectRatio?: number;

  isPaused: boolean;
  onPlayPausePress: () => void;

  isMuted: boolean;
  onMutePress: () => void;

  onFullScreenPress: () => void;

  onSeekRequest: (time: number) => void;
  onSeekByRequest: (time: number) => void;
}
const MediaControls: React.FC<React.PropsWithChildren<Props>> = ({
  enabled,
  enableFullScreen,
  isFullScreen,
  enableMute,
  currentTime,
  seekerStart,
  seekerEnd,
  mediaDuration,
  title,
  loading = false,
  isMini = false,
  isBuffering,
  isPaused,
  onPlayPausePress,
  isMuted,
  onMutePress,
  onFullScreenPress,

  onSeekRequest,
  onSeekByRequest,
  extraControls,
  aspectRatio,
}) => {
  const [visible, setVisible] = useState(enabled);
  const [scrubbing, setScrubbing] = useState(false);
  const [seekerPosition, setSeekerPosition] = useState(0);

  const seekPanResponder = useRef<PanResponderInstance>(undefined);
  const seekerWidth = useRef(0);
  const offset = useRef(0);

  const {colors} = useTheme();

  const isMiniPlayer = isMini && !isFullScreen;
  const isLiveStream = isNaN(mediaDuration) || !isFinite(mediaDuration) || mediaDuration <= 0;
  const showSeeker = (!isLiveStream || seekerEnd - seekerStart > 60) && !isNaN(seekerPosition);

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
      const normalizedPosition = (currentTime - seekerStart) / (seekerEnd - seekerStart);
      setPosition(normalizedPosition * seekerWidth.current);
    }
  }, [currentTime, seekerStart, seekerEnd, scrubbing, setPosition]);

  seekPanResponder.current = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: (event, _gestureState) => {
        const {pageX, locationX} = event.nativeEvent;
        offset.current = pageX - locationX;
        setPosition(event.nativeEvent.locationX);
        setScrubbing(true);
        resetControlsTimeout();
      },

      onPanResponderMove: (event, _gestureState) => {
        const {pageX} = event.nativeEvent;
        const positionX = pageX - offset.current;
        setPosition(positionX);
        resetControlsTimeout();
      },

      onPanResponderRelease: (event, _gestureState) => {
        const {pageX} = event.nativeEvent;
        const positionX = pageX - offset.current;
        const newPosition = setPosition(positionX);
        const normalizedPosition = Math.max(0, Math.min(seekerWidth.current, newPosition));
        const percentage = normalizedPosition / seekerWidth.current;
        const newTime = (seekerEnd - seekerStart) * percentage;

        onSeekRequest(newTime);
        resetControlsTimeout();

        setTimeout(() => {
          setScrubbing(false);
        }, 400);
      },
    });
  }, [seekerStart, seekerEnd, onSeekRequest, resetControlsTimeout, setPosition]);

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

  const handleLiveBadgeClick = useCallback(() => {
    onSeekRequest(seekerEnd);
    resetControlsTimeout();
  }, [onSeekRequest, resetControlsTimeout, seekerEnd]);

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
        style={{
          ...styles.playPauseIcon,
          width: styles.playPauseIcon.width,
          height: styles.playPauseIcon.height,
        }}
        onPress={handlePlayPauseToggle}
        hitSlop={HIT_SLOP}
        activeOpacity={0.6}>
        {isPaused ? (
          <IconPlayerPlayV2 size={ICON_SIZE} color={ICON_COLOR} />
        ) : (
          <IconPlayerPauseV2 size={ICON_SIZE} color={ICON_COLOR} />
        )}
      </TouchableOpacity>
    ),
    [handlePlayPauseToggle, isPaused],
  );

  const CenterControls = useMemo(
    () => (
      <View style={styles.conterControlsRow}>
        {showSeeker && !isMiniPlayer && (
          <TouchableOpacity onPress={handleSeekBack} hitSlop={HIT_SLOP} activeOpacity={0.6}>
            <IconPlayerRewind
              style={styles.rewindIcon}
              size={ICON_SIZE + (isMiniPlayer ? 6 : 12)}
              color={ICON_COLOR}
            />
          </TouchableOpacity>
        )}
        {PlayPauseControl}
        {showSeeker && !isMiniPlayer && (
          <TouchableOpacity onPress={handleSeekForward} hitSlop={HIT_SLOP} activeOpacity={0.6}>
            <IconPlayerForward
              style={styles.forwardIcon}
              size={ICON_SIZE + (isMiniPlayer ? 6 : 12)}
              color={ICON_COLOR}
            />
          </TouchableOpacity>
        )}
      </View>
    ),
    [PlayPauseControl, handleSeekBack, handleSeekForward, isLiveStream, isMiniPlayer, showSeeker],
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
    () =>
      title && !isMiniPlayer ? (
        <TextComponent
          style={styles.titleText}
          allowFontScaling={false}
          fontFamily="SourceSansPro-SemiBold"
          numberOfLines={2}>
          {title}
        </TextComponent>
      ) : null,
    [title, isMiniPlayer],
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
        style={{
          ...styles.seekBar_container,
          marginVertical: styles.seekBar_container.marginVertical,
        }}
        {...seekPanResponder.current?.panHandlers}
        hitSlop={HIT_SLOP_BIG}>
        <View
          style={styles.seekBar_track}
          onLayout={(event) => (seekerWidth.current = event.nativeEvent.layout.width)}
          pointerEvents={'none'}>
          <View
            style={[
              styles.seekBar_fill,
              {
                width: position,
                backgroundColor: colors.playerIcons,
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
  const isEnding = !isLiveStream && seekerEnd - currentTime <= 1;
  const shouldBeVisible = enabled && (isOnStart || isEnding || visible);

  return shouldBeVisible ? (
    <Animated.View
      style={[styles.flex, styles.center, {aspectRatio}]}
      //Wait for fix on android
      entering={Platform.OS === 'android' ? undefined : FadeIn.duration(400)}
      exiting={Platform.OS === 'android' ? undefined : FadeOut.duration(400)}
      // entering={FadeIn.duration(400)}
      // exiting={FadeOut.duration(400)}
    >
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        colors={['#000000FF', '#00000088', '#00000066', '#22222233']}
        useAngle={true}
        angle={0}
      />
      <Pressable
        style={{...StyleSheet.absoluteFillObject, bottom: ICON_SIZE}}
        onPressIn={handleHideControls}
      />
      <Title />
      {CenterControls}

      <View style={styles.bottomControlsContainer}>
        {showSeeker && (
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
                <TimerControl time={formatTimeElapsed(currentTime ?? 0, seekerEnd)} />
                {showSeeker ? <TimerControl time={formatTimeTotal(seekerEnd ?? 0)} /> : null}
              </>
            ) : (
              <>
                <TouchableDebounce onPress={handleLiveBadgeClick}>
                  <LiveBadge />
                </TouchableDebounce>
                <TimerControl
                  time={formatLiveStreamTime(currentTime ?? seekerStart, seekerStart, seekerEnd)}
                />
              </>
            )}
          </View>
          {extraControls}
          {ChromeCastControl}
          {enableFullScreen ? FullScreenControl : null}
        </View>
      </View>
    </Animated.View>
  ) : (
    <Pressable
      collapsable={false}
      style={{
        ...styles.flex,
        aspectRatio,
      }}
      onPressIn={handleShowControls}
      // onPress={handleShowControls}
    />
  );
};

export default MediaControls;

const styles = StyleSheet.create({
  flex: {
    width: '100%',
    maxHeight: '100%',
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
    minHeight: ICON_SIZE,
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
    backgroundColor: '#FFFFFFFF',
    width: '100%',
  },
  seekBar_fill: {
    height: 5,
  },
  activityIndicator: {
    alignSelf: 'flex-end',
    margin: 4,
  },
});

const formatTimeElapsed = (currentTime: number, duration: number) => {
  const time = Math.floor(Math.min(Math.max(currentTime, 0), duration));
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatLiveStreamTime = (time: number, minTime: number, maxTime: number) => {
  const currentTime = Math.max(0, maxTime - time);
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const result = `-${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatTimeTotal = (duration: number) => {
  const time = Math.max(duration, 0);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};
