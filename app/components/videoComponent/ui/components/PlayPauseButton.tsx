import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {IconPlayerPauseV2, IconPlayerPlayV2} from '../../../svg';
import {ICON_COLOR, ICON_SIZE, HIT_SLOP} from '../MediaControls.constants';
import {usePlayer} from '../../context/player/usePlayer';
import {PlayerButton} from './playerButton/PlayerButton';

const PlayPauseButton: React.FC = () => {
  const {
    state: {isPaused},
    actions: {playPause},
  } = usePlayer();

  return (
    <PlayerButton style={styles.playPauseIcon} onPress={playPause} hitSlop={HIT_SLOP} activeOpacity={0.6}>
      {isPaused ? (
        <IconPlayerPlayV2 size={ICON_SIZE} color={ICON_COLOR} />
      ) : (
        <IconPlayerPauseV2 size={ICON_SIZE} color={ICON_COLOR} />
      )}
    </PlayerButton>
  );
};

export default memo(PlayPauseButton);

const styles = StyleSheet.create({
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
});
