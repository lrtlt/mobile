import React from 'react';
import {AppTheme, themeLight} from '../Theme';

const defaults: AppTheme = {
  ...themeLight,
};

export const ThemeContext = React.createContext<AppTheme>(defaults);
