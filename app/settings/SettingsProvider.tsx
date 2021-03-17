import React from 'react';
import {SettingsContext} from './SettingsContext';
import {useSelector} from 'react-redux';
import {selectSettings} from '../redux/selectors';

const SettingsProvider: React.FC = (props) => {
  const config = useSelector(selectSettings, (l, r) => {
    try {
      return JSON.stringify(l) === JSON.stringify(r);
    } catch (e) {
      return false;
    }
  });

  return <SettingsContext.Provider value={config}>{props.children}</SettingsContext.Provider>;
};

export default SettingsProvider;
