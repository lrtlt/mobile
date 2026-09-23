import {useCallback, useEffect} from 'react';
import {useNavigationStore} from '../../state/navigation_store';
import {useShallow} from 'zustand/shallow';
import {useArticleStore} from '../../state/article_store';

const useSplashScreenState = () => {
  const {fetchMenuItemsV2} = useNavigationStore.getState();
  const {fetchHomeV3} = useArticleStore.getState();
  const isHomeError = useArticleStore((state) => state.homeV3.isError);

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
      fetchHomeV3();
    }
  }, [state.isReady]);

  const load = useCallback(
    (ignoreError = false) => {
      if ((state.isError || isHomeError) && ignoreError === false) {
        return;
      }
      if (state.isReady) {
        // With the menu in, only the home page request can have failed. The first
        // request comes from the effect above, so this is only for retries.
        if (ignoreError) {
          fetchHomeV3();
        }
      } else if (state.isLoading !== true) {
        fetchMenuItemsV2();
      }
    },
    [state, isHomeError],
  );

  return {
    ...state,
    isError: state.isError || isHomeError,
    load,
  };
};

export default useSplashScreenState;
