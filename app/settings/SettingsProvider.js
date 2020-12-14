import React from 'react';
import {SettingsContext} from './SettingsContext';
import {useSelector} from 'react-redux';
import {selectConfig} from '../redux/selectors';

const SettingsProvider = (props) => {
  const config = useSelector(selectConfig, (l, r) => {
    try {
      return JSON.stringify(l) === JSON.stringify(r);
    } catch (e) {
      return false;
    }
  });

  return <SettingsContext.Provider value={config}>{props.children}</SettingsContext.Provider>;
};

export default SettingsProvider;
