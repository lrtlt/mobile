import {ProgramResponse} from '../../api/Types';
import {ProgramActionType} from '../actions';
import {FETCH_PROGRAM, API_PROGRAM_RESULT, API_PROGRAM_ERROR} from '../actions/actionTypes';

export type ProgramState = {
  isFetching: boolean;
  isError: boolean;
  program?: ProgramResponse;
  lastFetchTime: number;
};

const initialState: ProgramState = {
  isFetching: false,
  isError: false,
  program: undefined,
  lastFetchTime: 0,
};

const reducer = (state = initialState, action: ProgramActionType): ProgramState => {
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
        program: action.data,
        lastFetchTime: Date.now(),
      };
    }
    default:
      return state;
  }
};

export default reducer;
