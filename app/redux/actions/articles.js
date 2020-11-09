import {
  FETCH_HOME,
  FETCH_MEDIATEKA,
  FETCH_CATEGORY,
  REFRESH_CATEGORY,
  FETCH_NEWEST,
  REFRESH_NEWEST,
  FETCH_POPULAR,
  REFRESH_POPULAR,
} from './actionTypes';

export const fetchArticles = () => ({type: FETCH_HOME});

export const fetchMediateka = () => ({type: FETCH_MEDIATEKA});

export const fetchCategory = (categoryId, count, page) => ({
  type: FETCH_CATEGORY,
  payload: {categoryId, count, page},
});

export const refreshCategory = (categoryId, count) => ({
  type: REFRESH_CATEGORY,
  payload: {categoryId, count},
});

export const fetchNewest = (page, count) => ({
  type: FETCH_NEWEST,
  payload: {page, count},
});

export const refreshNewest = (count) => ({
  type: REFRESH_NEWEST,
  payload: {page: 0, count},
});

export const fetchPopular = (page, count) => ({
  type: FETCH_POPULAR,
  payload: {page, count},
});

export const refreshPopular = (count) => ({
  type: REFRESH_POPULAR,
  payload: {page: 0, count},
});
