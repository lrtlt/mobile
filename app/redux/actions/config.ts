import {DailyQuestionChoice, ForecastLocation} from '../../api/Types';
import {ConfigState} from '../reducers/config';
import {SET_CONFIG, SET_FORECAST_LOCATION, SET_DAILY_QUESTION_CHOICE, UPDATE_LOGO_CACHE} from './actionTypes';

export interface SetConfigAction {
  type: typeof SET_CONFIG;
  payload: ConfigState;
}
export const setConfig = (value: ConfigState): SetConfigAction => ({
  type: SET_CONFIG,
  payload: value,
});

export interface SetForecastLocationAction {
  type: typeof SET_FORECAST_LOCATION;
  payload?: ForecastLocation;
}
export const setForecastLocation = (value?: ForecastLocation): SetForecastLocationAction => ({
  type: SET_FORECAST_LOCATION,
  payload: value,
});

export interface SetDailyQuestionChoice {
  type: typeof SET_DAILY_QUESTION_CHOICE;
  payload: {
    daily_question_id: number;
    choice: DailyQuestionChoice;
  };
}

export const setDailyQuestionChoice = (
  daily_question_id: number,
  choice: DailyQuestionChoice,
): SetDailyQuestionChoice => ({
  type: SET_DAILY_QUESTION_CHOICE,
  payload: {
    daily_question_id,
    choice,
  },
});

export type UpdateLogoCacheAction = {
  type: typeof UPDATE_LOGO_CACHE;
  data: {
    url: string;
    svg: string;
  };
};
export const updateLogoCache = (cache: {url: string; svg: string}): UpdateLogoCacheAction => ({
  type: UPDATE_LOGO_CACHE,
  data: cache,
});

export type ConfigActionType =
  | SetConfigAction
  | SetForecastLocationAction
  | SetDailyQuestionChoice
  | UpdateLogoCacheAction;
