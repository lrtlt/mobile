import React from 'react';

export type Settings = {
  isDarkMode: boolean;
  textSizeMultiplier: number;
  imageMaxScaleFactor: number;
};

const defaultSettings: Settings = {
  isDarkMode: false,
  textSizeMultiplier: 0,
  imageMaxScaleFactor: -0.1,
};

export const SettingsContext = React.createContext<Settings>(defaultSettings);
