import React from 'react';
import {SettingsContext} from './SettingsContext';
import {useSelector} from 'react-redux';
import {selectSettings} from '../redux/selectors';
import {checkEqual} from '../util/LodashEqualityCheck';

const SettingsProvider: React.FC = (props) => {
  const config = useSelector(selectSettings, checkEqual);
  return <SettingsContext.Provider value={config}>{props.children}</SettingsContext.Provider>;
};

export default SettingsProvider;
