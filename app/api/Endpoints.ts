import {AIUserEvent, SEARCH_TYPE_AUDIO, SearchFilter} from './Types';

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
export const articleGet = (articleId: number | string, isMedia?: boolean) => {
  return `${BASE_URL}article/${articleId}${isMedia ? '?media' : ''}`;
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

/**
 * Returns home page data for a category by it's id.
 */
export const categoryHomeGet = (id: number | string) => {
  return `${BASE_URL}category-home?id=${id}`;
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

export const mediatekaGetV2 = () => {
  return `${BASE_URL}category-home?id=672`;
};

/**
 * Returns Audioteka screen's data.
 */
export const audiotekaGet = () => {
  return `${BASE_URL}audioteka-home`;
};

export const radiotekaGet = () => {
  return `${BASE_URL}audioteka-home/v2`;
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
export const forecastGet = (cityCode: string) => `https://www.lrt.lt/servisai/orai/?code=${cityCode}`;

export const liveFeedGet = (id: string | number, count: number, order: 'desc' | 'asc') =>
  `${BASE_URL}get-feed-items/${id}?count=${count}&order=${order}`;

export const articleRecommendations = (articleId: number | string) =>
  `https://peach.ebu.io/api/v1/ltlrt/similar?article_id=${articleId}`;

export const articlesByIds = (ids: string[]) => `${BASE_URL}search?ids=${ids.join(',')}`;

export const articlesByGenre = (genreId: number | string, count: number) =>
  `${BASE_URL}search?genre_ids=${genreId}&type=${SEARCH_TYPE_AUDIO}&count=${count}`;

export const artcilesByCategory = (category_id: number | string, count: number) =>
  `${BASE_URL}search?type=2&category_id=${category_id}&count=${count}`;

export const getRadiotekaArticleByUrl = (url: string) => `https://www.lrt.lt/radioteka/api/media?url=${url}`;

export const genreGet = (genreId: number | string) => `https://www.lrt.lt/rest-api/genres/${genreId}`;

export const carPlaylistNewestGet = () => 'https://www.lrt.lt/static/carplay/naujausi.json';

export const carPlaylistPopularGet = () => 'https://www.lrt.lt/static/carplay/pop.json';

export const carPlaylistRecommendedGet = () => 'https://www.lrt.lt/static/carplay/rekomenduoja.json';

export const carPlaylistCategoryGet = (id: number | string) => `${BASE_URL}category?id=${id}`;

export const tvProgramsGet = () => 'https://www.lrt.lt/static/tvprog/tvprog.json';

export const getRadiotekaArticlesBySeason = (seasonUrl: string, page: number, count: number) =>
  `https://www.lrt.lt/api/search?type=2&season_url=${seasonUrl}&order=desc&page=${page}&count=${count}`;

export const getMediatekaArticlesBySeason = (seasonUrl: string, page: number, count: number) =>
  `https://www.lrt.lt/api/search?type=3&season_url=${seasonUrl}&order=desc&page=${page}&count=${count}`;

export const counter = (id: string | number, os: string) =>
  `https://www.lrt.lt/api/counter?id=${id}&app=${os}`;

export const getAISearchResults = (
  query: string,
  pageSize: number,
  orderBy?: string,
  pageToken?: string,
  includeAISummary?: boolean,
) => {
  return (
    `https://ai-search.lrt.lt/v1/lt/search?` +
    `query=${query}` +
    `${pageSize ? `&pageSize=${pageSize}` : ''}` +
    `${orderBy ? `&orderBy=${orderBy}` : ''}` +
    `${pageToken ? `&pageToken=${pageToken}` : ''}` +
    `${includeAISummary ? `&includeSummary=${includeAISummary}` : ''}` +
    `${includeAISummary ? `&includeCitations=false` : ''}`
  );
};

export const postSearchUserEvent = (event: AIUserEvent): string => {
  switch (event.type) {
    case 'view-item':
      return `https://ai-search.lrt.lt/v1/user-events/view-item`;
    case 'view-home-page':
      return `https://ai-search.lrt.lt/v1/user-events/view-home-page`;
    case 'media-play':
      return `https://ai-search.lrt.lt/v1/user-events/media-play`;
    case 'media-complete':
      return `https://ai-search.lrt.lt/v1/user-events/media-complete`;
  }
};

export const getAISummary = (query: string) => `https://ai-search.lrt.lt/v1/lt/ai-overview?query=${query}`;

export const fetchAIAutocomplete = (query: string) =>
  `https://ai-search.lrt.lt/v1/lt/search/autocomplete?query=${query}&maxSuggestions=6&minQueryLength=1`;

///Personl user endpoints

export const getUserData = () => `https://www.lrt.lt/servisai/authrz/user/me`;

export const putUserOnboardingCompleted = (completed: boolean) =>
  `https://www.lrt.lt/servisai/authrz/user/set-onboarding-completed/${completed ? 1 : 0}`;

export const putArticleToHistory = (articleId: number | string) =>
  `https://www.lrt.lt/servisai/authrz/user/history/${articleId}`;

export const getArticleHistory = (page: number) => `https://www.lrt.lt/servisai/authrz/user/history/${page}`;

export const getArticleFavorites = () => `https://www.lrt.lt/servisai/authrz/user/articles`;

export const putArticleToFavorite = (articleId: number | string) =>
  `https://www.lrt.lt/servisai/authrz/user/articles/${articleId}`;

export const deleteArticleFromFavorite = (articleId: number | string) =>
  `https://www.lrt.lt/servisai/authrz/user/articles/${articleId}`;
