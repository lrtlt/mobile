import {
  AudiotekaResponse,
  CategoryArticlesResponse,
  DailyQuestionResponse,
  HomeDataResponse,
  NewestArticlesResponse,
  PopularArticlesResponse,
} from '../../api/Types';
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
  API_NEWEST_ERROR,
  API_POPULAR_ERROR,
  API_NEWEST_RESULT,
  API_POPULAR_RESULT,
  API_MEDIATEKA_ERROR,
  API_MEDIATEKA_RESULT,
  API_AUDIOTEKA_ERROR,
  API_AUDIOTEKA_RESULT,
  API_CATEGORY_ERROR,
  API_CATEGORY_RESULT,
  API_DAILY_QUESTION_RESULT,
} from './actionTypes';

export type FetchHomeAction = {
  type: typeof FETCH_HOME;
};
export const fetchHome = (): FetchHomeAction => ({type: FETCH_HOME});

export type FetchHomeResultAction = {
  type: typeof API_HOME_RESULT;
  data: HomeDataResponse;
};

export const fetchHomeResult = (data: HomeDataResponse): FetchHomeResultAction => ({
  type: API_HOME_RESULT,
  data,
});

export type FetchDailyQuestionResultAction = {
  type: typeof API_DAILY_QUESTION_RESULT;
  data: DailyQuestionResponse;
};

export const fetchDailyQuestionResult = (data: DailyQuestionResponse): FetchDailyQuestionResultAction => ({
  type: API_DAILY_QUESTION_RESULT,
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

export type FetchMediatekaResultAction = {
  type: typeof API_MEDIATEKA_RESULT;
  data: HomeDataResponse;
};
export const fetchMediatekaResult = (data: HomeDataResponse): FetchMediatekaResultAction => ({
  type: API_MEDIATEKA_RESULT,
  data,
});

export type FetchMediatekaErrorAction = {
  type: typeof API_MEDIATEKA_ERROR;
};
export const fetchMediatekaError = (): FetchMediatekaErrorAction => ({type: API_MEDIATEKA_ERROR});

export type FetchAudiotekaAction = {
  type: typeof FETCH_AUDIOTEKA;
};
export const fetchAudioteka = (): FetchAudiotekaAction => ({type: FETCH_AUDIOTEKA});

export type FetchAudiotekaErrorAction = {
  type: typeof API_AUDIOTEKA_ERROR;
};
export const fetchAudiotekaError = (): FetchAudiotekaErrorAction => ({type: API_AUDIOTEKA_ERROR});

export type FetchAudiotekaResultAction = {
  type: typeof API_AUDIOTEKA_RESULT;
  data: AudiotekaResponse;
};
export const fetchAudiotekaResult = (data: AudiotekaResponse): FetchAudiotekaResultAction => ({
  type: API_AUDIOTEKA_RESULT,
  data,
});

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

export type FetchCategoryArticlesErrorAction = {
  type: typeof API_CATEGORY_ERROR;
  categoryId: number;
};
export const fetchCategoryError = (categoryId: number): FetchCategoryArticlesErrorAction => ({
  type: API_CATEGORY_ERROR,
  categoryId,
});

export type FetchCategoryArticlesResultAction = {
  type: typeof API_CATEGORY_RESULT;
  data: CategoryArticlesResponse;
};
export const fetchCategoryResult = (data: CategoryArticlesResponse): FetchCategoryArticlesResultAction => ({
  type: API_CATEGORY_RESULT,
  data,
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

export type FetchNewestArticlesErrorAction = {
  type: typeof API_NEWEST_ERROR;
};
export const fetchNewestError = (): FetchNewestArticlesErrorAction => ({
  type: API_NEWEST_ERROR,
});

export type FetchNewestArticlesResultAction = {
  type: typeof API_NEWEST_RESULT;
  data: NewestArticlesResponse;
};
export const fetchNewestResult = (data: NewestArticlesResponse): FetchNewestArticlesResultAction => ({
  type: API_NEWEST_RESULT,
  data,
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

export type FetchPopularArticlesErrorAction = {
  type: typeof API_POPULAR_ERROR;
};
export const fetchPopularError = (): FetchPopularArticlesErrorAction => ({
  type: API_POPULAR_ERROR,
});

export type FetchPopularArticlesResultAction = {
  type: typeof API_POPULAR_RESULT;
  data: PopularArticlesResponse;
};
export const fetchPopularResult = (data: PopularArticlesResponse): FetchPopularArticlesResultAction => ({
  type: API_POPULAR_RESULT,
  data,
});

export type ArticlesActionType =
  | FetchHomeAction
  | FetchHomeResultAction
  | FetchHomeErrorAction
  | FetchMediatekaAction
  | FetchMediatekaResultAction
  | FetchMediatekaErrorAction
  | FetchAudiotekaAction
  | FetchAudiotekaResultAction
  | FetchAudiotekaErrorAction
  | FetchCategoryArticlesAction
  | FetchCategoryArticlesErrorAction
  | FetchCategoryArticlesResultAction
  | RefreshCategoryArticlesAction
  | FetchNewestArticlesAction
  | RefreshNewestArticlesAction
  | FetchNewestArticlesErrorAction
  | FetchNewestArticlesResultAction
  | FetchPopularArticlesAction
  | FetchPopularArticlesResultAction
  | RefreshPopularArticlesAction
  | FetchPopularArticlesErrorAction
  | FetchDailyQuestionResultAction;
