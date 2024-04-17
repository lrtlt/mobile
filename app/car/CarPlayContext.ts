import React from 'react';

export type CarCategory = 'live' | 'newest';

export type PlayListItem = {
  id: string | number;
  text: string;
  detailText?: string;
  imgUrl: string;
  streamUrl: string;
};

export type CarPlayContextType = {
  isConnected: boolean;
  selectedCategory?: CarCategory;
};

const defaults: CarPlayContextType = {
  isConnected: false,
};

export const CarPlayContext = React.createContext<CarPlayContextType>(defaults);
