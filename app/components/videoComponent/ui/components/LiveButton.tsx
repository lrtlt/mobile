import React, {memo} from 'react';
import LiveBadge from '../../../liveBadge/LiveBadge';
import {usePlayer} from '../../context/player/usePlayer';
import {PlayerButton} from './playerButton/PlayerButton';

const LiveButton: React.FC = () => {
  const {
    actions: {seekToLive},
  } = usePlayer();

  return (
    <PlayerButton onPress={seekToLive}>
      <LiveBadge />
    </PlayerButton>
  );
};

export default memo(LiveButton);
