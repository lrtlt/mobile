import {ProgramResponse} from '../../api/Types';
import {API_PROGRAM_ERROR, API_PROGRAM_RESULT, FETCH_PROGRAM} from './actionTypes';

export type FetchProgramAction = {
  type: typeof FETCH_PROGRAM;
};
export const fetchProgram = (): FetchProgramAction => ({
  type: FETCH_PROGRAM,
});

export type FetchProgramErrorAction = {
  type: typeof API_PROGRAM_ERROR;
};
export const fetchProgramError = (): FetchProgramErrorAction => ({
  type: API_PROGRAM_ERROR,
});

export type FetchProgramResultAction = {
  type: typeof API_PROGRAM_RESULT;
  data: ProgramResponse;
};
export const fetchProgramResult = (data: ProgramResponse): FetchProgramResultAction => ({
  type: API_PROGRAM_RESULT,
  data,
});

export type ProgramActionType = FetchProgramAction | FetchProgramErrorAction | FetchProgramResultAction;
