import React, {PropsWithChildren, useMemo} from 'react';
import {AppTheme, themeDark, themeLight} from '../Theme';
import {useSettings} from '../settings/useSettings';
import {ThemeContext} from './ThemeContext';

const ThemeProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const settings = useSettings();
  console.log('SETTINGS', settings);
  const {isDarkMode} = settings;

  const context: AppTheme = useMemo(() => (isDarkMode ? themeDark : themeLight), [isDarkMode]);

  return <ThemeContext.Provider value={context}>{props.children}</ThemeContext.Provider>;
};

export default ThemeProvider;
