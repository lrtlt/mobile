import React from 'react';

export type PlayListItem = {
  id: string | number;
  text: string;
  detailText: string;
  imgUrl: string;
  isPlaying: boolean;
  streamUrl: string;
};

export type CarPlayContextType = {
  isConnected: boolean;
  playlist: PlayListItem[];
  setPlaylist: (playlist: PlayListItem[]) => void;
  playItem: (item: PlayListItem) => void;
};

const defaults: CarPlayContextType = {
  isConnected: false,
  playlist: [],
  setPlaylist: () => {},
  playItem: () => {},
};

export const CarPlayContext = React.createContext<CarPlayContextType>(defaults);
