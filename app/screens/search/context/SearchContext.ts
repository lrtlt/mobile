import React from 'react';
import {SearchFilter, SEARCH_TYPE_ALL} from '../../../api/Types';

export type SearchContextType = {
  query: string;
  setQuery: (q: string) => void;
  filter: SearchFilter;
  setFilter: (filter: SearchFilter) => void;
};

export const defaultSearchFilter: SearchFilter = {
  searchExactPhrase: true,
  searchOnlyHeritage: false,
  type: SEARCH_TYPE_ALL,
  section: '',
  days: '',
};

const noOp = () => {};

export const SearchContext = React.createContext<SearchContextType>({
  query: '',
  setQuery: noOp,
  filter: defaultSearchFilter,
  setFilter: noOp,
});
