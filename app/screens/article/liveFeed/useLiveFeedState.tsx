import {useCallback, useEffect, useState} from 'react';
import {LiveFeedResponse} from '../../../api/Types';
import useCancellablePromise from '../../../hooks/useCancellablePromise';
import {fetchLiveFeed} from '../../../api';

type State = {
  feed?: LiveFeedResponse;
  loadingState: typeof STATE_LOADING | typeof STATE_ERROR | typeof STATE_READY;
};

type ReturnType = {
  state: State;
  reload: () => void;
};

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

export const useLiveFeedState = (liveFeedId: string): ReturnType => {
  const [state, setState] = useState<State>(() => ({
    feed: undefined,
    loadingState: STATE_LOADING,
  }));

  const cancellablePromise = useCancellablePromise();
  const reload = useCallback(() => {
    cancellablePromise(fetchLiveFeed(liveFeedId, 200, 'desc'))
      .then((response) => {
        setState({
          feed: response,
          loadingState: STATE_READY,
        });
      })
      .catch((e) => {
        console.log(e);
        setState({
          ...state,
          loadingState: STATE_ERROR,
        });
      });
  }, [liveFeedId]);

  return {
    state,
    reload,
  };
};
