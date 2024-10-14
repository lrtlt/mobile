import {useCallback} from 'react';
import {ARTICLES_PER_PAGE_COUNT} from '../../../../../constants';
import {ArticleScreenAdapter} from './Types';
import {initialCategoryState, PagingState, useArticleStore} from '../../../../../state/article_store';

const useCategoryArticlesProvider: ArticleScreenAdapter = (categoryId?: number, categoryTitle?: string) => {
  const {fetchCategory} = useArticleStore.getState();
  const state = useArticleStore((state) => state.categories[categoryId ?? -1]) ?? {
    ...initialCategoryState,
    id: categoryId ?? initialCategoryState.id,
    title: categoryTitle ?? initialCategoryState.id,
  };

  const {nextPage, lastArticle} = state;

  const loadNextPage = useCallback(() => {
    if (nextPage !== null && categoryId) {
      if (lastArticle) {
        fetchCategory(
          categoryId,
          nextPage,
          ARTICLES_PER_PAGE_COUNT,
          lastArticle.item_date,
          String(lastArticle.id),
        );
      } else {
        fetchCategory(categoryId, nextPage, ARTICLES_PER_PAGE_COUNT);
      }
    } else {
      console.warn('Category ID cannot be empty');
    }
  }, [categoryId, nextPage, lastArticle]);

  const refresh = useCallback(() => {
    if (categoryId) {
      fetchCategory(categoryId, 1, ARTICLES_PER_PAGE_COUNT, undefined, undefined, true);
    } else {
      console.warn('Category ID cannot be empty');
    }
  }, [categoryId]);

  return {
    state: state as PagingState,
    loadNextPage,
    refresh,
  };
};

export default useCategoryArticlesProvider;
