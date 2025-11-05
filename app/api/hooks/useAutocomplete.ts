import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {AIAutomcompleteResponse} from '../Types';

const QUERY_KEY = 'autocomplete';

export const useAutocomplete = (q: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, q],
    queryFn: async ({signal}) => {
      const response = await get<AIAutomcompleteResponse>(
        `https://ai-search.lrt.lt/v1/lt/search/autocomplete?query=${q}&maxSuggestions=6&minQueryLength=1`,
        {
          signal,
        },
      );
      return response;
    },
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
    enabled: q.length > 2,
  });
};
