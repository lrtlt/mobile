import React, {PropsWithChildren, useMemo} from 'react';
import {AppTheme, themeDark, themeLight} from '../Theme';
import {ThemeContext} from './ThemeContext';
import {useSettingsStore} from '../state/settings';
import {useShallow} from 'zustand/react/shallow';

type Props = {
  forceTheme?: AppTheme;
};

const ThemeProvider: React.FC<PropsWithChildren<Props>> = ({children, forceTheme}) => {
  const settings = useSettingsStore(useShallow((state) => state));
  console.log('SETTINGS', settings);
  const {isDarkMode} = settings;

  const context: AppTheme = useMemo(
    () => (forceTheme ? forceTheme : isDarkMode ? themeDark : themeLight),
    [isDarkMode, forceTheme],
  );

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
