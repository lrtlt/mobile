import { ADD_ARTICLE_TO_HISTORY, SAVE_ARTICLE, REMOVE_ARTICLE } from '../actions/actionTypes';
import { ARTICLE_HISTORY_COUNT, ARTICLE_SAVED_MAX_COUNT } from '../../constants';

const initialState = {
  history: [],
  savedArticles: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLE_TO_HISTORY: {
      const { history } = state;

      //Check if the same article already exists in history. Filter out if exists.
      const filteredHistory = history.filter(a => a.id != action.article.id);
      //Add article to the front of array.
      filteredHistory.unshift(action.article);

      if (filteredHistory.length > ARTICLE_HISTORY_COUNT) {
        filteredHistory.pop();
      }

      return {
        ...state,
        history: filteredHistory,
      };
    }
    case SAVE_ARTICLE: {
      const { savedArticles } = state;
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
      const { savedArticles } = state;
      const filteredArticles = savedArticles.filter(a => a.id != action.articleId);
      return {
        ...state,
        savedArticles: filteredArticles,
      };
    }
    default:
      return state;
  }
};

const mapArticleData = article => {
  return {
    id: article.article_id,
    category_title: article.category_title,
    category_id: article.category_id,
    title: article.article_title,
    url: article.article_url,
    photo: article.main_photo.path,
  };
};

export default reducer;
