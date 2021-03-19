import {ADD_ARTICLE_TO_HISTORY, SAVE_ARTICLE, REMOVE_ARTICLE} from '../actions/actionTypes';
import {ARTICLE_HISTORY_COUNT, ARTICLE_SAVED_MAX_COUNT} from '../../constants';
import {ArticleStorageActionType} from '../actions';
import {ArticleContent, ArticleContentMedia} from '../../api/Types';

export type SavedArticle = {
  id: number;
  title: string;
  subtitle?: string;
  category_title?: string;
  category_id?: number;
  url?: string;
  photo: string;
  is_video?: 1 | 0;
};

export type ArticleStorageState = {
  history: SavedArticle[];
  savedArticles: SavedArticle[];
};

const initialState: ArticleStorageState = {
  history: [],
  savedArticles: [],
};

const reducer = (state = initialState, action: ArticleStorageActionType): ArticleStorageState => {
  switch (action.type) {
    case ADD_ARTICLE_TO_HISTORY: {
      const {history} = state;
      const article = mapArticleData(action.article);
      //Check if the same article already exists in history. Filter out if exists.
      const filteredHistory = history.filter((a) => a.id !== article.id);
      filteredHistory.unshift(article);

      if (filteredHistory.length > ARTICLE_HISTORY_COUNT) {
        filteredHistory.pop();
      }

      return {
        ...state,
        history: filteredHistory,
      };
    }
    case SAVE_ARTICLE: {
      const {savedArticles} = state;
      savedArticles.unshift(mapArticleData(action.article));

      if (savedArticles.length > ARTICLE_SAVED_MAX_COUNT) {
        savedArticles.pop();
      }

      return {
        ...state,
        savedArticles,
      };
    }
    case REMOVE_ARTICLE: {
      const {savedArticles} = state;
      const filteredArticles = savedArticles.filter((a) => a.id !== action.articleId);
      return {
        ...state,
        savedArticles: filteredArticles,
      };
    }
    default:
      return state;
  }
};

const mapArticleData = (article: ArticleContent): SavedArticle => {
  const isMedia = (a: any): a is ArticleContentMedia => {
    return Boolean(a.id);
  };

  if (isMedia(article)) {
    return {
      id: article.id,
      category_title: article.category_title,
      category_id: article.category_id,
      title: article.title,
      url: article.url,
      photo: article.main_photo?.path,
      subtitle: article.subtitle,
      is_video: article.is_video,
    };
  } else {
    return {
      id: article.article_id,
      category_title: article.category_title,
      category_id: article.category_id,
      title: article.article_title,
      url: article.article_url,
      photo: article.main_photo?.path,
      subtitle: article.article_subtitle,
      is_video: article.is_video,
    };
  }
};

export default reducer;
