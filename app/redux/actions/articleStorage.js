import { ADD_ARTICLE_TO_HISTORY, SAVE_ARTICLE, REMOVE_ARTICLE } from './actionTypes';

export const addArticleToHistory = article => ({
  type: ADD_ARTICLE_TO_HISTORY,
  article,
});

export const saveArticle = article => ({
  type: SAVE_ARTICLE,
  article,
});

export const removeArticle = articleId => ({
  type: REMOVE_ARTICLE,
  articleId,
});
