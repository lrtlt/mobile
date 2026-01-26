import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {IconFullscreen, IconFullscreenExit} from '../../../svg';
import {ICON_COLOR, ICON_SIZE, HIT_SLOP} from '../MediaControls.constants';
import {usePlayer} from '../../context/player/usePlayer';
import {PlayerButton} from './playerButton/PlayerButton';

const FullScreenButton: React.FC = () => {
  const {
    actions: {toggleFullScreen},
    state: {isFullScreen},
  } = usePlayer();

  return (
    <PlayerButton
      style={styles.fullScreenIcon}
      onPress={toggleFullScreen}
      hitSlop={HIT_SLOP}
      activeOpacity={0.6}>
      {isFullScreen ? (
        <IconFullscreenExit size={ICON_SIZE} color={ICON_COLOR} />
      ) : (
        <IconFullscreen size={ICON_SIZE - 6} color={ICON_COLOR} />
      )}
    </PlayerButton>
  );
};

export default memo(FullScreenButton);

const styles = StyleSheet.create({
  fullScreenIcon: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
