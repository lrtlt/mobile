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
export const articleGet = articleId => {
  return `${BASE_URL}article/${articleId}`;
};

/**
 * Returns article array for a category by it's id.
 */
export const categoryGet = (id, count, page) => {
  return `${BASE_URL}category?id=${id}&count=${count}&page=${page}`;
};

export const categoryTopsGet = (id, count) => {
  return `${BASE_URL}category/top?id=${id}&count=${count}`;
};

/**
 * Returns array of articles for hashtag
 */
export const articleGetByTag = (tag, count) => {
  return `${BASE_URL}articles/tag/${tag}?count=${count}`;
};

/**
 * Return array of articles by search filter
 */
export const searchArticles = (query, filter = { type: 0, section: '', days: '' }) => {
  return `${BASE_URL}search?q=${query}&type=${filter.type}&section=${filter.section}&days=${filter.days}`;
};

/**
 * Return array of currently newest articles
 */
export const newestArticlesGet = (count, page) => {
  return `${BASE_URL}articles/top?count=${count}&page=${page}`;
};

/**
 * Return array of currently most popular articles in last 24 hours
 */
export const popularArticlesGet = (count, page) => {
  return `${BASE_URL}articles/pop24?count=${count}&page=${page}`;
};

/**
 * Returns channel page data by it's id
 */
export const channelGet = id => {
  return `${BASE_URL}tv/channel/${id}`;
};

/**
 * Returns Mediateka screen's data. Same as for Home page data.
 */
export const mediatekaGet = () => {
  return `${BASE_URL}mediateka-home`;
};

/**
 * Returns all channels TV program data for a week.
 */
export const programGet = () => {
  return `${BASE_URL}tvprog`;
};
