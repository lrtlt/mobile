import { ADD_ARTICLE_TO_HISTORY } from '../actions/actionTypes';
import { ARTICLE_HISTORY_COUNT } from '../../constants';

const initialState = {
  history: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLE_TO_HISTORY: {
      console.log(state);
      const { history } = state;

      //Check if the same article already exists in history. Filter out if exists.
      const filteredHistory = history.filter(a => a.id != action.article.id);
      //Add article to the front of array.
      filteredHistory.unshift(action.article);

      if (filteredHistory.length > ARTICLE_HISTORY_COUNT) {
        //Remove oldest entry
        filteredHistory.pop();
      }

      const newState = {
        ...state,
        history: filteredHistory,
      };

      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
