import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {PanResponder, StyleSheet, View} from 'react-native';
import {PlayerEventType} from 'react-native-theoplayer';
import {useTheme} from '../../../../Theme';
import {HIT_SLOP_BIG} from '../MediaControls.constants';
import {usePlayer, useControlsVisibility} from '../../context/player/usePlayer';

const SeekBar: React.FC = () => {
  const {
    player,
    actions: {seek},
    state: {seekerStart, seekerEnd},
  } = usePlayer();

  const {
    visibilityActions: {resetVisibilityTimeout},
  } = useControlsVisibility();

  const {colors} = useTheme();

  const [scrubbing, setScrubbing] = useState(false);
  const [seekerPosition, setSeekerPosition] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const seekerWidth = useRef(0);
  const offset = useRef(0);

  useEffect(() => {
    if (!player) return;

    const handleTimeUpdate = () => {
      if (!scrubbing) {
        setCurrentTime(player.currentTime / 1000);
      }
    };

    player.addEventListener(PlayerEventType.TIME_UPDATE, handleTimeUpdate);

    // Set initial values
    setCurrentTime(player.currentTime / 1000);

    return () => {
      player.removeEventListener(PlayerEventType.TIME_UPDATE, handleTimeUpdate);
    };
  }, [player, scrubbing]);

  const setPosition = useCallback((position: number) => {
    const pos = Math.max(0, Math.min(seekerWidth.current, position));
    setSeekerPosition(pos);
    return pos;
  }, []);

  useEffect(() => {
    if (!scrubbing && seekerEnd > seekerStart) {
      const normalizedPosition = (currentTime - seekerStart) / (seekerEnd - seekerStart);
      setPosition(normalizedPosition * seekerWidth.current);
    }
  }, [currentTime, seekerStart, seekerEnd, scrubbing, setPosition]);

  const seekPanResponderHandlers = useMemo(() => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: (event, _gestureState) => {
        const {pageX, locationX} = event.nativeEvent;
        offset.current = pageX - locationX;
        setPosition(event.nativeEvent.locationX);
        setScrubbing(true);
        resetVisibilityTimeout();
      },

      onPanResponderMove: (event, _gestureState) => {
        const {pageX} = event.nativeEvent;
        const positionX = pageX - offset.current;
        setPosition(positionX);
        resetVisibilityTimeout();
      },

      onPanResponderRelease: (event, _gestureState) => {
        const {pageX} = event.nativeEvent;
        const positionX = pageX - offset.current;
        const newPosition = setPosition(positionX);
        const normalizedPosition = Math.max(0, Math.min(seekerWidth.current, newPosition));
        const percentage = normalizedPosition / seekerWidth.current;
        // Seek to an absolute time within the seekable window. For live streams
        // `seekerStart` is non-zero, so we must offset by it, otherwise we'd
        // seek to a time outside the seekable range and iOS would snap back to
        // the live edge.
        const newTime = seekerStart + (seekerEnd - seekerStart) * percentage;

        seek(newTime);

        setTimeout(() => {
          setScrubbing(false);
        }, 400);
      },
    });
    return panResponder.panHandlers;
  }, [seekerStart, seekerEnd, seek, resetVisibilityTimeout, setPosition]);

  const handleSeekerLayout = useCallback((event: {nativeEvent: {layout: {width: number}}}) => {
    seekerWidth.current = event.nativeEvent.layout.width;
  }, []);

  const seekBarFillStyle = useMemo(
    () => [styles.seekBar_fill, {width: seekerPosition, backgroundColor: colors.playerIcons}],
    [seekerPosition, colors.playerIcons],
  );

  return (
    <View style={styles.seekBar_container} {...seekPanResponderHandlers} hitSlop={HIT_SLOP_BIG}>
      <View style={styles.seekBar_track} onLayout={handleSeekerLayout} pointerEvents={'none'}>
        <View style={seekBarFillStyle} pointerEvents={'none'} />
      </View>
    </View>
  );
};

export default memo(SeekBar);

const styles = StyleSheet.create({
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
});
