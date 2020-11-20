import {useContext} from 'react';
import {Settings, SettingsContext} from './SettingsContext';

export function useSettings(): Settings {
  return useContext(SettingsContext);
}
