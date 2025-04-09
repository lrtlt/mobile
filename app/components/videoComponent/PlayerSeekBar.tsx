import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {PanResponder, PanResponderInstance, StyleSheet, View, ViewStyle} from 'react-native';
import {LoadedMetadataEvent, PlayerEventType, THEOplayer, TimeUpdateEvent} from 'react-native-theoplayer';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

const formatTimeElapsed = (currentTime: number, duration: number) => {
  const time = Math.floor(Math.min(Math.max(currentTime / 1000, 0), duration / 1000));
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatLiveStreamTime = (time: number, maxTime: number) => {
  const currentTime = Math.max(0, maxTime - time) / 1000;
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const result = `-${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

const formatTimeTotal = (duration: number) => {
  const time = Math.max(duration / 1000, 0);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return result;
};

interface Props {
  style?: ViewStyle;
  player: THEOplayer;
}

const PlayerSekBar: React.FC<React.PropsWithChildren<Props>> = ({style, player}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekerPosition, setSeekerPosition] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  const {colors} = useTheme();

  const seekPanResponder = useRef<PanResponderInstance>(undefined);

  const offset = useRef(0);
  const seekerWidth = useRef(0);

  const seekerStart = player.seekable[0]?.start ?? 1;
  const seekerEnd = player.seekable[0]?.end ?? 1;

  const isLiveStream = isNaN(duration) || !isFinite(duration) || duration <= 0;
  const isSeekableMoreThanMinute = seekerEnd - seekerStart > 60 * 1000;
  const showSeeker = (!isLiveStream || isSeekableMoreThanMinute) && !isNaN(seekerPosition);

  const setPosition = useCallback((position: number) => {
    const pos = Math.max(0, Math.min(seekerWidth.current, position));
    setSeekerPosition(pos);
    return pos;
  }, []);

  useEffect(() => {
    if (player) {
      const onTimeUpdateHandler = (e: TimeUpdateEvent) => {
        setCurrentTime(e.currentTime);
      };

      const onLoadedMetaDataHandler = (e: LoadedMetadataEvent) => {
        const duration = e.duration === Infinity ? 0 : e.duration;
        setDuration(duration);
      };

      const onLoadedDataHandler = (_: any) => {
        setIsLoading(false);
      };

      player.addEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdateHandler);
      player.addEventListener(PlayerEventType.LOADED_METADATA, onLoadedMetaDataHandler);
      player.addEventListener(PlayerEventType.LOADED_DATA, onLoadedDataHandler);

      return () => {
        player.removeEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdateHandler);
        player.removeEventListener(PlayerEventType.LOADED_METADATA, onLoadedMetaDataHandler);
        player.removeEventListener(PlayerEventType.LOADED_DATA, onLoadedDataHandler);
      };
    }
  }, [player]);

  useEffect(() => {
    if (!scrubbing) {
      const normalizedPosition = (currentTime - seekerStart) / (seekerEnd - seekerStart);
      setPosition(normalizedPosition * seekerWidth.current);
    }
  }, [currentTime, seekerStart, seekerEnd, scrubbing]);

  seekPanResponder.current = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,
      onPanResponderTerminationRequest: () => true,

      onPanResponderTerminate: (evt, gestureState) => {
        console.log('onPanResponderTerminate', evt, gestureState);
      },

      onPanResponderGrant: (event, _gestureState) => {
        const {pageX, locationX} = event.nativeEvent;
        offset.current = pageX - locationX;
        setPosition(locationX);
        setScrubbing(true);
      },

      onPanResponderMove: (event, _gestureState) => {
        const {pageX} = event.nativeEvent;
        const positionX = pageX - offset.current;
        setPosition(positionX);
      },

      onPanResponderRelease: (event, _gestureState) => {
        const {pageX} = event.nativeEvent;
        const positionX = pageX - offset.current;
        const newPosition = setPosition(positionX);
        const normalizedPosition = Math.max(0, Math.min(seekerWidth.current, newPosition));
        const percentage = normalizedPosition / seekerWidth.current;
        const newTime = (seekerEnd - seekerStart) * percentage;
        player.currentTime = newTime;
        setTimeout(() => {
          setScrubbing(false);
        }, 300);
      },
    });
  }, [seekerStart, seekerEnd, setPosition, player]);

  const TimerControl = useCallback(
    ({time}: {time: string}) => (
      <TextComponent
        style={{...styles.timerText, color: colors.darkIcon}}
        allowFontScaling={false}
        fontFamily="SourceSansPro-SemiBold">
        {time}
      </TextComponent>
    ),
    [],
  );

  if (isLoading) {
    return <View style={styles.root} />;
  }

  if (!showSeeker) {
    return (
      <View style={styles.root}>
        <View style={{flex: 1, height: 1, backgroundColor: colors.border}} />
        {isLiveStream ? (
          <TextComponent style={{...styles.liveText, color: colors.darkIcon}}>gyvai</TextComponent>
        ) : null}
        <View style={{flex: 1, height: 1, backgroundColor: colors.border}} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {isLiveStream ? null : <TimerControl time={formatTimeElapsed(currentTime, seekerEnd)} />}
      <View
        style={{
          ...styles.seekBar_container,
          marginVertical: styles.seekBar_container.marginVertical,
          ...style,
        }}
        {...seekPanResponder.current?.panHandlers}
        hitSlop={12}>
        <View
          style={styles.seekBar_track}
          onLayout={(event) => (seekerWidth.current = event.nativeEvent.layout.width)}
          pointerEvents="none">
          <View
            style={[
              styles.seekBar_fill,
              {
                backgroundColor: colors.playerIcons,
                width: isNaN(seekerPosition) ? 0 : seekerPosition,
              },
            ]}
            pointerEvents={'none'}
          />
        </View>
      </View>
      {isLiveStream ? (
        <TimerControl time={formatLiveStreamTime(currentTime ?? seekerStart, seekerEnd)} />
      ) : (
        <TimerControl time={formatTimeTotal(seekerEnd)} />
      )}
    </View>
  );
};

export default PlayerSekBar;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 24,
  },
  seekBar_container: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 6,
    justifyContent: 'center',
  },
  seekBar_track: {
    borderRadius: 2,
    height: 4,
    overflow: 'hidden',
    backgroundColor: '#EEE',
    width: '100%',
  },
  seekBar_fill: {
    height: 5,
  },
  timerText: {
    flexGrow: 0,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  liveText: {
    flexGrow: 0,
    fontSize: 12,
    color: '#000',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
