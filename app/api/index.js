const BASE_URL = 'https://www.lrt.lt/api/json/';

export const menuGet = () => {
  const method = 'menu';
  return BASE_URL + method;
};

export const homeGet = () => {
  return `${BASE_URL}home`;
};

export const articleGet = articleId => {
  return `${BASE_URL}article/${articleId}`;
};

export const categoryGet = (id, count, page) => {
  return `${BASE_URL}category?id=${id}&count=${count}&page=${page}`;
};

export const categoryTopsGet = (id, count) => {
  return `${BASE_URL}category/top?id=${id}&count=${count}`;
};

export const articleGetByTag = (tag, count) => {
  return `${BASE_URL}articles/tag/${tag}?count=${count}`;
};

export const searchArticles = (query, filter = { type: 0, section: '', days: '' }) => {
  return `${BASE_URL}search?q=${query}&type=${filter.type}&section=${filter.section}&days=${filter.days}`;
};

export const newestArticlesGet = (count, page) => {
  return `${BASE_URL}articles/top?count=${count}&page=${page}`;
};

export const channelGet = id => {
  return `${BASE_URL}tv/channel/${id}`;
};

export const mediatekaGet = () => {
  return `${BASE_URL}mediateka-home`;
};

export const programGet = () => {
  return `${BASE_URL}tvprog`;
};
