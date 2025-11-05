import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {AISummaryResponse} from '../Types';

const QUERY_KEY = 'ai-summary';

export const useAISummary = (q: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, q],
    queryFn: async ({signal}) => {
      const response = await get<AISummaryResponse>(`https://ai-search.lrt.lt/v1/lt/ai-overview?query=${q}`, {
        signal,
      });
      return response?.overview?.summary;
    },
    refetchOnMount: false,
    enabled: q.length > 2,
  });
};
