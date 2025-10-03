import {useCallback, useEffect} from 'react';
import {useNavigationStore} from '../../state/navigation_store';
import {useShallow} from 'zustand/shallow';
import {useArticleStore} from '../../state/article_store';

const useSplashScreenState = () => {
  const {fetchMenuItemsV2} = useNavigationStore.getState();
  const {fetchHome} = useArticleStore.getState();

  const state = useNavigationStore(
    useShallow((state) => ({
      isError: state.isError,
      isLoading: state.isLoading,
      isReady: state.routesV2.length > 0,
    })),
  );

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (state.isReady) {
      fetchHome();
    }
  }, [state.isReady]);

  const load = useCallback(
    (ignoreError = false) => {
      if (state.isError && ignoreError === false) {
        return;
      }
      if (state.isLoading !== true) {
        fetchMenuItemsV2();
      }
    },
    [state],
  );

  return {
    ...state,
    load,
  };
};

export default useSplashScreenState;
