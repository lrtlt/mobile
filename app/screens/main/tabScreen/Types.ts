import {PagingState} from '../../../redux/reducers/articles';

export type ArticleScreenAdapter = (categorId?: number, categoryTitle?: string) => ArticleScreenAdapterState;

export type ArticleScreenAdapterState = {
  state: PagingState;
  loadNextPage: () => void;
  refresh: () => void;
};
