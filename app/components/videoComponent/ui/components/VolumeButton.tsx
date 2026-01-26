import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {IconPlayerMute, IconPlayerVolume} from '../../../svg';
import {ICON_COLOR, ICON_SIZE, HIT_SLOP} from '../MediaControls.constants';
import {usePlayer} from '../../context/player/usePlayer';
import {PlayerButton} from './playerButton/PlayerButton';

const VolumeButton: React.FC = () => {
  const {
    state: {isMuted},
    actions: {toggleMute},
  } = usePlayer();

  return (
    <PlayerButton style={styles.volumeIcon} onPress={toggleMute} hitSlop={HIT_SLOP} activeOpacity={0.6}>
      {isMuted ? (
        <IconPlayerMute size={ICON_SIZE} color={ICON_COLOR} />
      ) : (
        <IconPlayerVolume size={ICON_SIZE} color={ICON_COLOR} />
      )}
    </PlayerButton>
  );
};

export default memo(VolumeButton);

const styles = StyleSheet.create({
  volumeIcon: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
