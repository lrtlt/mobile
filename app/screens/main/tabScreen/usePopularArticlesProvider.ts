import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ARTICLES_PER_PAGE_COUNT} from '../../../constants';
import {fetchPopular, refreshPopular} from '../../../redux/actions';
import {selectPopularArticlesScreenState} from '../../../redux/selectors';
import {ArticleScreenAdapter} from './Types';

const usePopularArticlesProvider: ArticleScreenAdapter = () => {
  const state = useSelector(selectPopularArticlesScreenState);
  const {page} = state;

  const dispatch = useDispatch();

  const loadNextPage = useCallback(() => {
    dispatch(fetchPopular(page + 1, ARTICLES_PER_PAGE_COUNT));
  }, [dispatch, page]);

  const refresh = useCallback(() => {
    dispatch(refreshPopular(ARTICLES_PER_PAGE_COUNT));
  }, [dispatch]);

  return {
    state,
    loadNextPage,
    refresh,
  };
};

export default usePopularArticlesProvider;
