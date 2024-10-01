import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {DailyQuestionChoice, ForecastLocation} from '../api/Types';
import {zustandStorage} from './mmkv';

type SettingsStore = {
  isDarkMode: boolean;
  isContinuousPlayEnabled: boolean;
  textSizeMultiplier: number;
  forecastLocation?: ForecastLocation;
  daily_question_response?: {
    daily_question_id: number;
    choice: DailyQuestionChoice;
  };
  logo?: {
    url: string;
    svg: string;
  };

  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsContinuousPlayEnabled: (isContinuousPlayEnabled: boolean) => void;
  setTextSizeMultiplier: (textSizeMultiplier: number) => void;
  setForecastLocation: (forecastLocation?: ForecastLocation) => void;
  setDailyQuestionChoice: (daily_question_id: number, choice: DailyQuestionChoice) => void;
  fetchLogo: (url?: string) => Promise<void>;
};

const initialState: Omit<
  SettingsStore,
  | 'setIsDarkMode'
  | 'setIsContinuousPlayEnabled'
  | 'setTextSizeMultiplier'
  | 'setForecastLocation'
  | 'setDailyQuestionChoice'
  | 'fetchLogo'
> = {
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
