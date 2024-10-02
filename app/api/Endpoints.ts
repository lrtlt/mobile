import {SearchFilter} from './Types';

const BASE_URL = 'https://www.lrt.lt/api/json/';

/**
 * Returns array of category items.
 */
export const menuGet = () => {
  return `${BASE_URL}menu`;
};

/**
 * Home page data.
 */
export const homeGet = () => {
  return `${BASE_URL}home/v2`;
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
export const categoryGet = (
  id: number | string,
  page: number,
  count: number,
  date_max?: string,
  not_id?: string,
) => {
  let url = `${BASE_URL}category?id=${id}&count=${count}`;
  if (page && !date_max && !not_id) {
    url += `&page=${page}`;
  }
  if (date_max) {
    url += `&date_max=${date_max}`;
  }
  if (not_id) {
    url += `&not_id=${not_id}`;
  }
  return url;
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
  let url = `${BASE_URL}search?q=${query}&type=${filter.type}&section=${filter.section}&days=${filter.days}&count=50`;

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
export const newestArticlesGet = (count: number, page: number, date_max?: string, not_id?: string) => {
  let url = `${BASE_URL}articles/top?count=${count}`;
  if (page && !date_max && !not_id) {
    url += `&page=${page}`;
  }
  if (date_max) {
    url += `&date_max=${date_max}`;
  }
  if (not_id) {
    url += `&not_id=${not_id}`;
  }
  return url;
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
  return `${BASE_URL}mediateka-home/v2`;
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
 * Sets a user vote on daily question.
 */
export const putDailyQuestionVote = (questionId: number | string, answerId: number | string) => {
  return `https://www.lrt.lt/api/v1/daily-question/${questionId}?answer=${answerId}`;
};

/**
 * Gets daily question.
 */
export const getDailyQuestion = (questionId: number | string) => {
  return `https://www.lrt.lt/api/v1/daily-question/${questionId}`;
};

/**
 * Returns forecast for selected city
 */
export const forecastGet = (cityCode: string) => {
  return `https://www.lrt.lt/servisai/orai/?code=${cityCode}`;
};

export const liveFeedGet = (id: string | number, count: number, order: 'desc' | 'asc') => {
  return `${BASE_URL}get-feed-items/${id}?count=${count}&order=${order}`;
};

export const carPlaylistNewestGet = () => 'https://www.lrt.lt/static/carplay/naujausi.json';

export const carPlaylistPopularGet = () => 'https://www.lrt.lt/static/carplay/pop.json';

export const carPlaylistRecommendedGet = () => 'https://www.lrt.lt/static/carplay/rekomenduoja.json';

export const carPlaylistPodcastsGet = (count: number) =>
  `https://www.lrt.lt/api/json/search/categories?type=audio&count=${count}`;

export const carPlaylistCategoryGet = (id: number | string) =>
  `https://www.lrt.lt/api/json/category?id=${id}`;

export const carPlaylistLiveGet = () => 'https://www.lrt.lt/static/tvprog/tvprog.json';
