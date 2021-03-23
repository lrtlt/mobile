import {ArticleContent} from '../../api/Types';
import {ADD_ARTICLE_TO_HISTORY, SAVE_ARTICLE, REMOVE_ARTICLE} from './actionTypes';

export type AddArticleToHistoryAction = {
  type: typeof ADD_ARTICLE_TO_HISTORY;
  article: ArticleContent;
};
export const addArticleToHistory = (article: ArticleContent): AddArticleToHistoryAction => ({
  type: ADD_ARTICLE_TO_HISTORY,
  article,
});

export type SaveArticleAction = {
  type: typeof SAVE_ARTICLE;
  article: ArticleContent;
};
export const saveArticle = (article: ArticleContent): SaveArticleAction => ({
  type: SAVE_ARTICLE,
  article,
});

export type RemoveArticleAction = {
  type: typeof REMOVE_ARTICLE;
  articleId: number;
};
export const removeArticle = (articleId: number) => ({
  type: REMOVE_ARTICLE,
  articleId,
});

export type ArticleStorageActionType = AddArticleToHistoryAction | SaveArticleAction | RemoveArticleAction;
