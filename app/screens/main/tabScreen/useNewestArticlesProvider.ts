import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ARTICLES_PER_PAGE_COUNT} from '../../../constants';
import {fetchNewest, refreshNewest} from '../../../redux/actions';
import {selectNewestArticlesScreenState} from '../../../redux/selectors';
import {ArticleScreenAdapter} from './Types';

const useNewestArticlesProvider: ArticleScreenAdapter = () => {
  const state = useSelector(selectNewestArticlesScreenState);
  const {page} = state;

  const dispatch = useDispatch();

  const loadNextPage = useCallback(() => {
    dispatch(fetchNewest(page + 1, ARTICLES_PER_PAGE_COUNT));
  }, [dispatch, page]);

  const refresh = useCallback(() => {
    dispatch(refreshNewest(ARTICLES_PER_PAGE_COUNT));
  }, [dispatch]);

  return {
    state,
    loadNextPage,
    refresh,
  };
};

export default useNewestArticlesProvider;
