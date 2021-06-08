import {useContext} from 'react';
import {SearchContext} from './SearchContext';

export default () => {
  return useContext(SearchContext);
};
