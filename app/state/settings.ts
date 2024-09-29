import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SettingsStore = {
  isDarkMode: boolean;
  isContinuousPlayEnabled: boolean;
  textSizeMultiplier: number;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsContinuousPlayEnabled: (isContinuousPlayEnabled: boolean) => void;
  setTextSizeMultiplier: (textSizeMultiplier: number) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isContinuousPlayEnabled: true,
      textSizeMultiplier: 0,
      setIsDarkMode: (isDarkMode: boolean) => set({isDarkMode: isDarkMode}),
      setIsContinuousPlayEnabled: (isContinuousPlayEnabled: boolean) => set({isContinuousPlayEnabled}),
      setTextSizeMultiplier: (textSizeMultiplier: number) => set({textSizeMultiplier}),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
