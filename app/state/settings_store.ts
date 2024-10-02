import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {DailyQuestionChoice, ForecastLocation} from '../api/Types';
import {zustandStorage} from './mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const runSettingsStorageMigration = async () => {
  if (zustandStorage.getItem('settings-storage-migrated')) return;

  const rootJson = await AsyncStorage.getItem('persist:root');
  if (rootJson) {
    console.log('## Migrating settings storage');
    const root = JSON.parse(rootJson);
    const settings = JSON.parse(root['config']);
    if (settings) {
      useSettingsStore.setState(settings);
      zustandStorage.setItem('settings-storage-migrated', 'true');
    }
  }
};

type SettingsStoreState = {
  isDarkMode: boolean;
  isContinuousPlayEnabled: boolean;
  textSizeMultiplier: number;
  //TODO: export to separate store
  logo?: {
    url: string;
    svg: string;
  };
  //TODO: export to separate store
  forecastLocation?: ForecastLocation;
  //TODO: export to separate store
  daily_question_response?: {
    daily_question_id: number;
    choice: DailyQuestionChoice;
  };
};

type SettingsStoreActions = {
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsContinuousPlayEnabled: (isContinuousPlayEnabled: boolean) => void;
  setTextSizeMultiplier: (textSizeMultiplier: number) => void;
  setForecastLocation: (forecastLocation?: ForecastLocation) => void;
  setDailyQuestionChoice: (daily_question_id: number, choice: DailyQuestionChoice) => void;
  fetchLogo: (url?: string) => Promise<void>;
};

type SettingsStore = SettingsStoreState & SettingsStoreActions;

const initialState: SettingsStoreState = {
  isDarkMode: false,
  isContinuousPlayEnabled: true,
  textSizeMultiplier: 0,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,
      setIsDarkMode: (isDarkMode) => set({isDarkMode: isDarkMode}),
      setIsContinuousPlayEnabled: (isContinuousPlayEnabled) => set({isContinuousPlayEnabled}),
      setTextSizeMultiplier: (textSizeMultiplier) => set({textSizeMultiplier}),
      setForecastLocation: (forecastLocation) => set({forecastLocation}),
      setDailyQuestionChoice: (daily_question_id, choice) =>
        set({daily_question_response: {daily_question_id, choice}}),
      fetchLogo: async (url) => {
        try {
          if (url) {
            const svg = await fetch(url).then((r) => r.text());
            if (svg) {
              set({logo: {url, svg}});
            }
          } else {
            set({logo: undefined});
          }
        } catch (e) {
          console.log('Update logo error', e);
        }
      },
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
