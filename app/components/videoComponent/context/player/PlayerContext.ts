import {createContext} from 'react';
import {THEOplayer} from 'react-native-theoplayer';
import {PlayerState} from '../../ui/usePlayerState';

export interface PlayerControlActions {
  play: () => void;
  playPause: () => void;
  toggleMute: () => void;
  toggleFullScreen: () => void;
  seek: (time: number) => void;
  seekBy: (delta: number) => void;
  seekToLive: () => void;
}

export interface ControlsVisibilityState {
  visible: boolean;
}

export interface ControlsVisibilityActions {
  showControls: () => void;
  hideControls: () => void;
  resetVisibilityTimeout: () => void;
}

export interface PlayerContextType {
  player: THEOplayer | undefined;
  actions: PlayerControlActions;
  visibility: ControlsVisibilityState;
  visibilityActions: ControlsVisibilityActions;
  state: PlayerState;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
