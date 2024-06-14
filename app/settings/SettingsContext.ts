import React from 'react';

export type Settings = {
  isDarkMode: boolean;
  isContinuousPlayEnabled: boolean;
  textSizeMultiplier: number;
};

const defaultSettings: Settings = {
  isDarkMode: false,
  isContinuousPlayEnabled: true,
  textSizeMultiplier: 0,
};

export const SettingsContext = React.createContext<Settings>(defaultSettings);
