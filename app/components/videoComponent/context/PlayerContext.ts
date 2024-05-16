import React from 'react';
import defaultPlayerContext from './DefaultPlayerContext';

// eslint-disable-next-line no-shadow
export enum MediaType {
  AUDIO,
  VIDEO,
}

export type MediaBaseData = {
  uri: string;
  title?: string;
  poster?: string;
  mediaType: MediaType;
  isLiveStream: boolean;
  startTime?: number;
};

export type PlayerContextType = {
  setPlaylist: (data: MediaBaseData[], current?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  close: () => void;
};

export const PlayerContext = React.createContext<PlayerContextType>(defaultPlayerContext);
