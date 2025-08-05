import {useCallback, useState} from 'react';
import {fetchAISummary} from '../../api';
import useCancellablePromise from '../../hooks/useCancellablePromise';

type ReturnType = {
  aiSummary?: string;
  callAISummaryApi: (q: string) => void;
  loadingState: {
    idle: boolean;
    isFetching: boolean;
    isError: boolean;
  };
};

const useAISummaryApi = (): ReturnType => {
  const [loadingState, setLoadingState] = useState({
    idle: true,
    isFetching: false,
    isError: false,
  });

  const [aiSummary, setAiSummary] = useState<string | undefined>(undefined);

  const cancellablePromise = useCancellablePromise();

  const callAISummaryApi = useCallback(
    (q: string) => {
      setAiSummary(undefined);
      setLoadingState({idle: false, isFetching: true, isError: false});
      cancellablePromise(fetchAISummary(q))
        .then((response) => {
          setLoadingState({
            idle: false,
            isFetching: false,
            isError: false,
          });
          setAiSummary(response.overview?.summary);
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
    aiSummary,
    callAISummaryApi,
  };
};

export default useAISummaryApi;
