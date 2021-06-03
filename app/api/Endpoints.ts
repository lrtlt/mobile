import {SearchFilter} from './Types';

const BASE_URL = 'https://www.lrt.lt/api/json/';

/**
 * Returns array of category items.
 */
export const menuGet = () => {
  const method = 'menu';
  return BASE_URL + method;
};

/**
 * Home page data.
 */
export const homeGet = () => {
  return `${BASE_URL}home`;
};

/**
 * Returns article screen data by articleId
 */
export const articleGet = (articleId: number | string) => {
  return `${BASE_URL}article/${articleId}`;
};

/**
 * Returns article array for a category by it's id.
 */
export const categoryGet = (id: number | string, count: number, page: number) => {
  return `${BASE_URL}category?id=${id}&count=${count}&page=${page}`;
};

export const categoryTopsGet = (id: number | string, count: number) => {
  return `${BASE_URL}category/top?id=${id}&count=${count}`;
};

/**
 * Returns array of articles for hashtag
 */
export const articlesGetByTag = (tag: string, count: number) => {
  return `${BASE_URL}articles/tag/${tag}?count=${count}`;
};

/**
 * Return array of articles by search filter
 */
export const searchArticles = (query: string, filter: SearchFilter) => {
  let url = `${BASE_URL}search?q=${query}&type=${filter.type}&section=${filter.section}&days=${filter.days}`;

  if (filter.searchExactPhrase) {
    url += '&exact=1';
  }
  if (filter.searchOnlyHeritage) {
    url += '&heritage=1';
  }

  return url;
};

/**
 * Return array of currently newest articles
 */
export const newestArticlesGet = (count: number, page: number) => {
  return `${BASE_URL}articles/top?count=${count}&page=${page}`;
};

/**
 * Return array of currently most popular articles in last 24 hours
 */
export const popularArticlesGet = (count: number, page: number) => {
  return `${BASE_URL}articles/pop24?count=${count}&page=${page}`;
};

/**
 * Returns channel page data by it's id
 */
export const channelGet = (id: number | string) => {
  return `${BASE_URL}tv/channel/${id}`;
};

/**
 * Returns available locations for weather
 */
export const weatherLocationsGet = () => {
  return 'https://www.lrt.lt/static/data/weather/places.json?v=1';
};

/**
 * Returns Mediateka screen's data. Same as for Home page data.
 */
export const mediatekaGet = () => {
  return `${BASE_URL}mediateka-home`;
};

/**
 * Returns Audioteka screen's data.
 */
export const audiotekaGet = () => {
  return `${BASE_URL}audioteka-home`;
};

/**
 * Returns all channels TV program data for a week.
 */
export const programGet = () => {
  return `${BASE_URL}tvprog`;
};

/**
 * Returns previously played songs
 */
export const opusPlaylistGet = () => {
  return `${BASE_URL}rds?station=opus`;
};

/**
 * Returns forecast for selected city
 */
export const forecastGet = (cityCode: string) => {
  return `https://www.lrt.lt/servisai/orai/?code=${cityCode}`;
};