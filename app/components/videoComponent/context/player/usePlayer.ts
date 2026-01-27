import {useContext} from 'react';
import {PlayerContext, PlayerContextType} from './PlayerContext';

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const useControlsVisibility = () => {
  const {visibility, visibilityActions} = usePlayer();
  return {visibility, visibilityActions};
};

export const usePlayerState = () => {
  const {state} = usePlayer();
  return state;
};
