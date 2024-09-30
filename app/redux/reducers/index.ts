import {combineReducers} from 'redux';
import articles from './articles';
import articleStorage from './articleStorage';

export type RootState = ReturnType<typeof reducer>;

const reducer = combineReducers({
  articles,
  articleStorage,
});
export default reducer;
