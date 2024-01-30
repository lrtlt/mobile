import React from 'react';

export type PlayListItem = {
  text: string;
  detailText: string;
  imgUrl: string;
  isPlaying: boolean;
};

export type CarPlayContextType = {
  isConnected: boolean;
  setPlaylist: (playlist: PlayListItem[]) => void;
};

const defaults: CarPlayContextType = {
  isConnected: false,
  setPlaylist: () => {},
};

export const CarPlayContext = React.createContext<CarPlayContextType>(defaults);
