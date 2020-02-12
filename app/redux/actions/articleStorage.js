import { ADD_ARTICLE_TO_HISTORY } from './actionTypes';

export const addArticleToHistory = article => ({
  type: ADD_ARTICLE_TO_HISTORY,
  article,
});
