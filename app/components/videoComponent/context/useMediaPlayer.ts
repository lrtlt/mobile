import React from 'react';
import {PlayerContext, PlayerContextType} from './PlayerContext';

export function useMediaPlayer(): PlayerContextType {
  return React.useContext(PlayerContext);
}
