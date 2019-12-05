import { combineReducers } from 'redux';
import articles from './articles';
import navigation from './navigation';
import config from './config';
import program from './program';

export default combineReducers({
  articles,
  navigation,
  program,
  config,
});
