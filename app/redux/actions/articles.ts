import {
  FETCH_HOME,
  FETCH_MEDIATEKA,
  FETCH_CATEGORY,
  REFRESH_CATEGORY,
  FETCH_NEWEST,
  REFRESH_NEWEST,
  FETCH_POPULAR,
  REFRESH_POPULAR,
  FETCH_AUDIOTEKA,
  API_HOME_RESULT,
  API_HOME_ERROR,
} from './actionTypes';

export type FetchHomeAction = {
  type: typeof FETCH_HOME;
};
export const fetchHome = (): FetchHomeAction => ({type: FETCH_HOME});

export type FetchHomeResultAction = {
  type: typeof API_HOME_RESULT;
  data: any;
};
export const fetchHomeResult = (data: any): FetchHomeResultAction => ({
  type: API_HOME_RESULT,
  data,
});

export type FetchHomeErrorAction = {
  type: typeof API_HOME_ERROR;
};
export const fetchHomeError = (): FetchHomeErrorAction => ({
  type: API_HOME_ERROR,
});

export type FetchMediatekaAction = {
  type: typeof FETCH_MEDIATEKA;
};
export const fetchMediateka = (): FetchMediatekaAction => ({type: FETCH_MEDIATEKA});

export type FetchAudiotekaAction = {
  type: typeof FETCH_AUDIOTEKA;
};
export const fetchAudioteka = (): FetchAudiotekaAction => ({type: FETCH_AUDIOTEKA});

export type FetchCategoryArticlesAction = {
  type: typeof FETCH_CATEGORY;
  payload: {
    categoryId: number;
    count: number;
    page: number;
  };
};
export const fetchCategory = (
  categoryId: number,
  count: number,
  page: number,
): FetchCategoryArticlesAction => ({
  type: FETCH_CATEGORY,
  payload: {categoryId, count, page},
});

export type RefreshCategoryArticlesAction = {
  type: typeof REFRESH_CATEGORY;
  payload: {
    categoryId: number;
    count: number;
  };
};
export const refreshCategory = (categoryId: number, count: number): RefreshCategoryArticlesAction => ({
  type: REFRESH_CATEGORY,
  payload: {categoryId, count},
});

export type FetchNewestArticlesAction = {
  type: typeof FETCH_NEWEST;
  payload: {
    page: number;
    count: number;
  };
};
export const fetchNewest = (page: number, count: number): FetchNewestArticlesAction => ({
  type: FETCH_NEWEST,
  payload: {page, count},
});

export type RefreshNewestArticlesAction = {
  type: typeof REFRESH_NEWEST;
  payload: {
    page: number;
    count: number;
  };
};
export const refreshNewest = (count: number): RefreshNewestArticlesAction => ({
  type: REFRESH_NEWEST,
  payload: {page: 0, count},
});

export type FetchPopularArticlesAction = {
  type: typeof FETCH_POPULAR;
  payload: {
    page: number;
    count: number;
  };
};
export const fetchPopular = (page: number, count: number): FetchPopularArticlesAction => ({
  type: FETCH_POPULAR,
  payload: {page, count},
});

export type RefreshPopularArticlesAction = {
  type: typeof REFRESH_POPULAR;
  payload: {
    page: number;
    count: number;
  };
};
export const refreshPopular = (count: number): RefreshPopularArticlesAction => ({
  type: REFRESH_POPULAR,
  payload: {page: 0, count},
});

export type ArticlesActionType =
  | FetchHomeAction
  | FetchMediatekaAction
  | FetchAudiotekaAction
  | FetchCategoryArticlesAction
  | RefreshCategoryArticlesAction
  | FetchNewestArticlesAction
  | RefreshNewestArticlesAction
  | FetchPopularArticlesAction
  | RefreshPopularArticlesAction;
