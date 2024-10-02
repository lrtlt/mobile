import {create} from 'zustand';
import {ProgramResponse} from '../api/Types';
import {fetchProgramApi} from '../api';

type ProgramStoreState = {
  isFetching: boolean;
  isError: boolean;
  program?: ProgramResponse;
  lastFetchTime: number;
};

type ProgramStoreActions = {
  fetchProgram: () => void;
};

type ProgramStore = ProgramStoreState & ProgramStoreActions;

const initialState: ProgramStoreState = {
  isFetching: false,
  isError: false,
  program: undefined,
  lastFetchTime: 0,
};

export const useProgramStore = create<ProgramStore>((set) => ({
  ...initialState,
  fetchProgram: async () => {
    set({isFetching: true, isError: false});
    try {
      console.log('Fetching program...');
      const data = await fetchProgramApi();
      set({isFetching: false, isError: false, program: data, lastFetchTime: Date.now()});
    } catch (e) {
      console.log('Error fetching program', e);
      set({isFetching: false, isError: true});
    }
  },
}));
