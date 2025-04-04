import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandStorage} from './mmkv';

type UserStoreState = {
  lastAdultContentAcceptedTime: number;
};

type UserStoreActions = {
  setLastAdultContentAcceptedTime: (time: number) => void;
};

type UserStore = UserStoreState & UserStoreActions;

const initialState: UserStoreState = {
  lastAdultContentAcceptedTime: 0,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      setLastAdultContentAcceptedTime: (time) => set({lastAdultContentAcceptedTime: time}),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
