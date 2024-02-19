import React from 'react';

export type Settings = {
  isDarkMode: boolean;
  textSizeMultiplier: number;
};

const defaultSettings: Settings = {
  isDarkMode: false,
  textSizeMultiplier: 0,
};

export const SettingsContext = React.createContext<Settings>(defaultSettings);
