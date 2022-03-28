import {DailyQuestionChoice, ForecastLocation} from '../../api/Types';
import {ConfigActionType} from '../actions';
import {
  TOGGLE_DARK_MODE,
  SET_TEXT_SIZE_MULTIPLIER,
  SET_IMAGE_SCALE_FACTOR,
  SET_CONFIG,
  SET_FORECAST_LOCATION,
  SET_DAILY_QUESTION_CHOICE,
  UPDATE_LOGO_CACHE,
} from '../actions/actionTypes';

export type ConfigState = {
  isDarkMode: boolean;
  textSizeMultiplier: number;
  imageMaxScaleFactor: number;
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
  imageMaxScaleFactor: -0.1,
  forecastLocation: undefined,
};

const reducer = (state: ConfigState = initialState, action: ConfigActionType): ConfigState => {
  switch (action.type) {
    case TOGGLE_DARK_MODE: {
      const isDarkMode = !state.isDarkMode;

      const newState = {
        ...state,
        isDarkMode,
      };
      return newState;
    }

    case SET_TEXT_SIZE_MULTIPLIER: {
      const newState = {
        ...state,
        textSizeMultiplier: action.multiplier,
      };
      return newState;
    }

    case SET_IMAGE_SCALE_FACTOR: {
      return {
        ...state,
        imageMaxScaleFactor: action.scaleFactor,
      };
    }
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
