import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {SlugArticlesResponse} from '../Types';

const QUERY_KEY = 'articlesByTag';

export const useArticlesByTag = (tag: string, count: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, tag, count],
    queryFn: async ({signal}) => {
      const response = await get<SlugArticlesResponse>(
        `https://www.lrt.lt/api/json/articles/tag/${tag}?count=${count}`,
        {
          signal,
        },
      );
      return response;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
