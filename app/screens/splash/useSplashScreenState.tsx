import {useDispatch, useSelector} from 'react-redux';
import {selectSplashScreenState} from '../../redux/selectors';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {useCallback, useEffect} from 'react';
import {fetchHome, fetchMenuItems} from '../../redux/actions';

type ReturnProps = ReturnType<typeof selectSplashScreenState> & {
  load: (ignoreError: boolean) => void;
};

const useSplashScreenState = (): ReturnProps => {
  const state = useSelector(selectSplashScreenState, checkEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.isReady !== true) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasMenuData]);

  const load = useCallback(
    (ignoreError = false) => {
      if (state.isError && ignoreError === false) {
        return;
      }

      if (state.isLoading !== true) {
        if (state.hasMenuData) {
          dispatch(fetchHome());
        } else {
          dispatch(fetchMenuItems());
        }
      }
    },
    [dispatch, state.hasMenuData, state.isError, state.isLoading],
  );

  return {
    ...state,
    load,
  };
};

export default useSplashScreenState;
