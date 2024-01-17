import React from 'react';

export type CarPlayContextType = {
  isConnected: boolean;
};

const defaults: CarPlayContextType = {
  isConnected: false,
};

export const CarPlayContext = React.createContext<CarPlayContextType>(defaults);
