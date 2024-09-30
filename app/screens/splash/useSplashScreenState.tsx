import {useDispatch} from 'react-redux';
import {useCallback, useEffect} from 'react';
import {fetchHome} from '../../redux/actions';
import {NavigationState, useNavigationStore} from '../../state/navigation_store';
import {useShallow} from 'zustand/shallow';

type ReturnProps = NavigationState & {
  load: (ignoreError: boolean) => void;
};

const useSplashScreenState = (): ReturnProps => {
  const state = useNavigationStore(useShallow((state) => state));
  const isLoaded = state.routes.length > 0;

  const dispatch = useDispatch();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      dispatch(fetchHome());
    }
  }, [isLoaded]);

  const load = useCallback(
    (ignoreError = false) => {
      if (state.isError && ignoreError === false) {
        return;
      }
      if (state.isLoading !== true) {
        state.fetchMenuItems();
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
