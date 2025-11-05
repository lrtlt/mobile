import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {SearchFilter, SearchResponse} from '../Types';

const QUERY_KEY = 'search';

export const useArticleSearch = (q: string, filter: SearchFilter) => {
  let url = `https://www.lrt.lt/api/json/search?q=${q}&type=${filter.type}&section=${filter.section}&days=${filter.days}&count=50`;

  if (filter.searchExactPhrase) {
    url += '&exact=1';
  }
  if (filter.searchOnlyHeritage) {
    url += '&heritage=1';
  }

  return useQuery({
    queryKey: [QUERY_KEY, q, filter],
    queryFn: async ({signal}) => {
      const response = await get<SearchResponse>(url, {
        signal,
      });
      return response;
    },
    refetchOnMount: false,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};
