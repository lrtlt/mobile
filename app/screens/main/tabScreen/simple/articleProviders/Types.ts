import {PagingState} from '../../../../../state/article_store';

export type ArticleScreenAdapter = (categorId?: number, categoryTitle?: string) => ArticleScreenAdapterState;

export type ArticleScreenAdapterState = {
  state: PagingState;
  loadNextPage: () => void;
  refresh: () => void;
};
