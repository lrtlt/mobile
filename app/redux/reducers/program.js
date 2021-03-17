import {FETCH_PROGRAM, API_PROGRAM_RESULT, API_PROGRAM_ERROR} from '../actions/actionTypes';

const initialState = {
  program: null,
  isFetching: false,
  isError: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROGRAM: {
      return {
        ...state,
        isFetching: true,
        isError: false,
      };
    }
    case API_PROGRAM_ERROR: {
      return {
        ...state,
        isFetching: false,
        isError: true,
      };
    }
    case API_PROGRAM_RESULT: {
      return {
        isFetching: false,
        isError: false,
        program: action.data.all_programs,
      };
    }
    default:
      return state;
  }
};

export default reducer;
