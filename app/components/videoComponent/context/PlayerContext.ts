import React from 'react';

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
  close: () => void;
};

const noOp = (): any => {
  console.warn('VideoContext: NO OP CALLED!');
};

export const PlayerContext = React.createContext<PlayerContextType>({
  setPlaylist: noOp,
  close: noOp,
});
