import {DailyQuestionChoice, ForecastLocation} from '../../api/Types';
import {ConfigActionType} from '../actions';
import {
  SET_CONFIG,
  SET_FORECAST_LOCATION,
  SET_DAILY_QUESTION_CHOICE,
  UPDATE_LOGO_CACHE,
} from '../actions/actionTypes';

export type ConfigState = {
  isDarkMode: boolean;
  textSizeMultiplier: number;
  isContinuousPlayEnabled: boolean;

  forecastLocation?: ForecastLocation;

  daily_question_response?: {
    daily_question_id: number;
    choice: DailyQuestionChoice;
  };

  logo?: {
    url: string;
    svg: string;
  };
};

const initialState = {
  isDarkMode: false,
  textSizeMultiplier: 0,
  isContinuousPlayEnabled: true,
  forecastLocation: undefined,
};

const reducer = (state: ConfigState = initialState, action: ConfigActionType): ConfigState => {
  switch (action.type) {
    case SET_CONFIG: {
      return {...state, ...action.payload};
    }
    case SET_FORECAST_LOCATION: {
      return {...state, forecastLocation: action.payload};
    }
    case SET_DAILY_QUESTION_CHOICE: {
      return {...state, daily_question_response: action.payload};
    }
    case UPDATE_LOGO_CACHE: {
      return {
        ...state,
        logo: action.data,
      };
    }
    default:
      return state;
  }
};

export default reducer;
