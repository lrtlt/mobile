import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {ProgramResponse, TVProgramResponse} from '../Types';

export const useWeeklyProgram = () => {
  return useQuery({
    queryKey: ['weeklyProgram'],
    queryFn: async ({signal}) => {
      const response = await get<ProgramResponse>('https://www.lrt.lt/api/json/tvprog', {
        signal,
      });
      return response;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes
    refetchInterval: 1000 * 60 * 1, // 1 minutes
  });
};

export const useCurrentProgram = () => {
  return useQuery({
    queryKey: ['currentProgram'],
    queryFn: async ({signal}) => {
      const response = await get<TVProgramResponse>('https://www.lrt.lt/static/tvprog/tvprog.json', {
        signal,
      });
      return response;
    },
    staleTime: 1000 * 60 * 1, // 1 minutes
    refetchInterval: 1000 * 60 * 1, // 1 minutes
  });
};
