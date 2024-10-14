import {useCallback} from 'react';

import {ARTICLES_PER_PAGE_COUNT} from '../../../../../constants';
import {ArticleScreenAdapter} from './Types';
import {useArticleStore} from '../../../../../state/article_store';
import {useShallow} from 'zustand/shallow';

const usePopularArticlesProvider: ArticleScreenAdapter = () => {
  const {fetchPopular} = useArticleStore.getState();
  const state = useArticleStore(useShallow((state) => state.popular));
  const {page} = state;

  const loadNextPage = useCallback(() => {
    fetchPopular(page + 1, ARTICLES_PER_PAGE_COUNT);
  }, [page]);

  const refresh = useCallback(() => {
    fetchPopular(1, ARTICLES_PER_PAGE_COUNT, true);
  }, []);

  return {
    state,
    loadNextPage,
    refresh,
  };
};

export default usePopularArticlesProvider;
