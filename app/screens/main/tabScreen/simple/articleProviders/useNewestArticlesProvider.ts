import {useCallback} from 'react';
import {ARTICLES_PER_PAGE_COUNT} from '../../../../../constants';
import {ArticleScreenAdapter} from './Types';
import {useArticleStore} from '../../../../../state/article_store';
import {useShallow} from 'zustand/shallow';

const useNewestArticlesProvider: ArticleScreenAdapter = () => {
  const {fetchNewest} = useArticleStore.getState();
  const state = useArticleStore(useShallow((state) => state.newest));
  const {page} = state;

  const loadNextPage = useCallback(() => {
    if (state.lastArticle) {
      fetchNewest(
        page + 1,
        ARTICLES_PER_PAGE_COUNT,
        state.lastArticle.item_date,
        String(state.lastArticle.id),
      );
    } else {
      fetchNewest(page + 1, ARTICLES_PER_PAGE_COUNT);
    }
  }, [page, state.lastArticle]);

  const refresh = useCallback(() => {
    fetchNewest(1, ARTICLES_PER_PAGE_COUNT, undefined, undefined, true);
  }, []);

  return {
    state,
    loadNextPage,
    refresh,
  };
};

export default useNewestArticlesProvider;
