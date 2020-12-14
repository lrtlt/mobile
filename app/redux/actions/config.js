import {
  TOGGLE_DARK_MODE,
  SET_TEXT_SIZE_MULTIPLIER,
  SET_IMAGE_SCALE_FACTOR,
  SET_CONFIG,
  SET_FORECAST_LOCATION,
} from './actionTypes';

export const toggleDarkMode = () => ({
  type: TOGGLE_DARK_MODE,
});

export const setTextSizeMultiplier = (value) => ({
  type: SET_TEXT_SIZE_MULTIPLIER,
  multiplier: value,
});

export const setImageMaxScaleFactor = (value) => ({
  type: SET_IMAGE_SCALE_FACTOR,
  scaleFactor: value,
});

export const setConfig = (value) => ({
  type: SET_CONFIG,
  payload: value,
});

export const setForecastLocation = (value) => ({
  type: SET_FORECAST_LOCATION,
  payload: value,
});
