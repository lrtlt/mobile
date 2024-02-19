import React, {useState} from 'react';
import {SearchFilter} from '../../../api/Types';
import {defaultSearchFilter, SearchContext} from './SearchContext';

const SearchContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>(defaultSearchFilter);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        filter,
        setFilter,
      }}>
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
