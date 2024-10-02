import {useCallback, useEffect} from 'react';
import {useNavigationStore} from '../../state/navigation_store';
import {useShallow} from 'zustand/shallow';
import {useArticleStore} from '../../state/article_store';

const useSplashScreenState = () => {
  const {fetchMenuItems} = useNavigationStore.getState();
  const {fetchHome} = useArticleStore.getState();

  const state = useNavigationStore(
    useShallow((state) => ({
      routes: state.routes,
      isError: state.isError,
      isLoading: state.isLoading,
      isReady: state.routes.length > 0,
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
        fetchMenuItems();
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
