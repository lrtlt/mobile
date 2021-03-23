import {combineReducers} from 'redux';
import articles from './articles';
import navigation from './navigation';
import config from './config';
import program from './program';
import articleStorage from './articleStorage';

export type RootState = ReturnType<typeof reducer>;

const reducer = combineReducers({
  articles,
  articleStorage,
  navigation,
  program,
  config,
});
export default reducer;
