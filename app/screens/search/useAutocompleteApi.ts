import {useCallback, useState} from 'react';
import {fetchAutocomplete} from '../../api';
import useCancellablePromise from '../../hooks/useCancellablePromise';

type ReturnType = {
  suggestions?: string[];
  callAutocompleteApi: (q: string) => void;
  loadingState: {
    idle: boolean;
    isFetching: boolean;
    isError: boolean;
  };
};

const useAutocompleteApi = (): ReturnType => {
  const [loadingState, setLoadingState] = useState({
    idle: true,
    isFetching: false,
    isError: false,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const cancellablePromise = useCancellablePromise();

  const callAutocompleteApi = useCallback(
    (q: string) => {
      setLoadingState({idle: false, isFetching: true, isError: false});
      cancellablePromise(fetchAutocomplete(q))
        .then((response) => {
          setLoadingState({
            idle: false,
            isFetching: false,
            isError: false,
          });
          setSuggestions(response.querySuggestions?.map((s) => s.suggestion).slice(0, 6) ?? []);
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
    suggestions,
    callAutocompleteApi,
  };
};

export default useAutocompleteApi;
