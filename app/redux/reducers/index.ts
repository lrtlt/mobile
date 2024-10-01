import {combineReducers} from 'redux';
import articles from './articles';

export type RootState = ReturnType<typeof reducer>;

const reducer = combineReducers({
  articles,
});
export default reducer;
