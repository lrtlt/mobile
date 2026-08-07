import React, {PropsWithChildren, useMemo} from 'react';
import {AppTheme, themeDark, themeLight} from '../Theme';
import {ThemeContext} from './ThemeContext';
import {useSettingsStore} from '../state/settings_store';

type Props = {
  forceTheme?: AppTheme;
};

const ThemeProvider: React.FC<PropsWithChildren<Props>> = ({children, forceTheme}) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  const context: AppTheme = useMemo(
    () => (forceTheme ? forceTheme : isDarkMode ? themeDark : themeLight),
    [isDarkMode, forceTheme],
  );

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
