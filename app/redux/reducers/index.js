import {combineReducers} from 'redux';
import articles from './articles';
import navigation from './navigation';
import config from './config';
import program from './program';
import articleStorage from './articleStorage';

export default combineReducers({
  articles,
  articleStorage,
  navigation,
  program,
  config,
});
