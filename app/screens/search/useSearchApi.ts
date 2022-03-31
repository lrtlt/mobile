import {useCallback, useState} from 'react';
import {Article} from '../../../Types';
import {fetchArticleSearch} from '../../api';
import {SearchCategorySuggestion, SearchFilter} from '../../api/Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';

type ReturnType = {
  searchResults: Article[];
  searchSuggestions: SearchCategorySuggestion[];
  callSearchApi: (q: string, filter: SearchFilter) => void;
  loadingState: {
    idle: boolean;
    isFetching: boolean;
    isError: boolean;
  };
};

const useSearchApi = (): ReturnType => {
  const [loadingState, setLoadingState] = useState({
    idle: true,
    isFetching: false,
    isError: false,
  });

  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchCategorySuggestion[]>([]);

  const cancellablePromise = useCancellablePromise();

  const callSearchApi = useCallback(
    (q: string, filter: SearchFilter) => {
      setLoadingState({idle: false, isFetching: true, isError: false});
      cancellablePromise(fetchArticleSearch(q, filter))
        .then((response) => {
          setLoadingState({
            idle: false,
            isFetching: false,
            isError: false,
          });
          setSearchResults(response.items);
          setSearchSuggestions(response.similar_categories);
        })
        .catch(() => {
          setLoadingState({
            idle: false,
            isFetching: false,
            isError: true,
          });
        });
    },
    [cancellablePromise],
  );

  return {
    loadingState,
    searchResults,
    searchSuggestions,
    callSearchApi,
  };
};

export default useSearchApi;
