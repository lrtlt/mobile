import {
  TOGGLE_DARK_MODE,
  SET_TEXT_SIZE_MULTIPLIER,
  SET_IMAGE_SCALE_FACTOR,
  SET_CONFIG,
} from '../actions/actionTypes';
import { initTheme } from '../../ColorTheme';

const initialState = {
  isDarkMode: false,
  textSizeMultiplier: 0,
  imageMaxScaleFactor: -0.1,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARK_MODE: {
      const isDarkMode = !state.isDarkMode;

      const newState = {
        ...state,
        isDarkMode,
      };
      initTheme(newState);
      return newState;
    }

    case SET_TEXT_SIZE_MULTIPLIER: {
      const newState = {
        ...state,
        textSizeMultiplier: action.multiplier,
      };
      initTheme(newState);
      return newState;
    }

    case SET_IMAGE_SCALE_FACTOR: {
      return {
        ...state,
        imageMaxScaleFactor: action.scaleFactor,
      };
    }
    case SET_CONFIG: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};

export default reducer;
