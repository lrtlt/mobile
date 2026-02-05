import React, {useMemo} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {ICON_SIZE} from './MediaControls.constants';
import {useControlsVisibility, usePlayerState} from '../context/player/usePlayer';
import Title from './components/Title';
import CenterButtons from './components/CenterButtons';
import SeekBar from './components/SeekBar';
import VolumeButton from './components/VolumeButton';
import Timer from './components/Timer';
import ChromeCastButton from './components/ChromeCastButton';
import FullScreenButton from './components/FullScreenButton';
import Overlay from './components/Overlay';

interface Props {
  enabled: boolean;
  enableFullScreen: boolean;
  enableMute: boolean;
  title?: string;
  extraControls?: React.JSX.Element[];
  aspectRatio?: number;
}

const MediaControls: React.FC<React.PropsWithChildren<Props>> = ({
  enabled,
  enableFullScreen,
  enableMute,
  title,
  extraControls,
  aspectRatio,
}) => {
  const {
    visibility,
    visibilityActions: {showControls, hideControls},
  } = useControlsVisibility();

  const {isBuffering, isSeekerEnabled} = usePlayerState();

  const containerStyle = useMemo(() => [styles.flex, styles.center, {aspectRatio}], [aspectRatio]);
  const hidePressableStyle = useMemo(() => ({...StyleSheet.absoluteFill, bottom: ICON_SIZE}), []);
  const showPressableStyle = useMemo(() => ({...styles.flex, aspectRatio}), [aspectRatio]);

  const visible = enabled && visibility.visible;

  if (!visible) {
    return <Pressable style={showPressableStyle} onPressIn={showControls} />;
  } else {
    return (
      <Animated.View style={containerStyle} entering={FadeIn.duration(400)} exiting={FadeOut.duration(400)}>
        <Overlay style={StyleSheet.absoluteFill} />
        <Pressable style={hidePressableStyle} onPressIn={hideControls} />
        <Title title={title} />
        <CenterButtons />

        <View style={styles.bottomControlsContainer}>
          <View>
            {isBuffering && <ActivityIndicator style={styles.activityIndicator} size="small" color="white" />}
            {isSeekerEnabled && <SeekBar />}
          </View>
          <View style={styles.bottomControlsRow}>
            {enableMute && <VolumeButton />}
            <Timer />
            {extraControls}
            <ChromeCastButton />
            {enableFullScreen && <FullScreenButton />}
          </View>
        </View>
      </Animated.View>
    );
  }
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
  centerControlsRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
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
  activityIndicator: {
    alignSelf: 'flex-end',
    margin: 4,
  },
});
