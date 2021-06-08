import {useCallback, useState} from 'react';
import {Article} from '../../../Types';
import {fetchArticleSearch} from '../../api';
import {SearchFilter} from '../../api/Types';

type ReturnType = {
  searchResults: Article[];
  callSearch: () => void;
  loadingState: {
    isFetching: boolean;
    isError: boolean;
  };
};

const useSearchApi = (query: string, filter: SearchFilter): ReturnType => {
  const [loadingState, setLoadingState] = useState({
    isFetching: false,
    isError: false,
  });

  const [searchResults, setSearchResults] = useState<Article[]>([]);

  return {
    loadingState,
    searchResults,
    callSearch: useCallback(() => {
      setLoadingState({isFetching: true, isError: false});
      fetchArticleSearch(query, filter)
        .then((response) => {
          setLoadingState({
            isFetching: false,
            isError: false,
          });
          setSearchResults(response.items);
        })
        .catch(() => {
          setLoadingState({
            isFetching: false,
            isError: true,
          });
        });
    }, [filter, query]),
  };
};

export default useSearchApi;
