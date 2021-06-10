import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ARTICLES_PER_PAGE_COUNT} from '../../../constants';
import {fetchCategory, refreshCategory} from '../../../redux/actions';
import {PagingState} from '../../../redux/reducers/articles';
import {selectCategoryScreenState} from '../../../redux/selectors';
import {ArticleScreenAdapter} from './Types';

const useCategoryArticlesProvider: ArticleScreenAdapter = (categoryId?: number, categoryTitle?: string) => {
  const state = useSelector(selectCategoryScreenState(categoryId!, categoryTitle));
  const {nextPage} = state;

  const dispatch = useDispatch();

  const loadNextPage = useCallback(() => {
    if (nextPage !== null && categoryId) {
      dispatch(fetchCategory(categoryId, ARTICLES_PER_PAGE_COUNT, nextPage));
    } else {
      console.warn('Category ID cannot be empty');
    }
  }, [categoryId, dispatch, nextPage]);

  const refresh = useCallback(() => {
    if (categoryId) {
      dispatch(refreshCategory(categoryId, ARTICLES_PER_PAGE_COUNT));
    } else {
      console.warn('Category ID cannot be empty');
    }
  }, [categoryId, dispatch]);

  return {
    state: state as PagingState,
    loadNextPage,
    refresh,
  };
};

export default useCategoryArticlesProvider;
