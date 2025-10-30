import {keepPreviousData, useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import {ArticleSearchResponse} from '../Types';

const QUERY_KEY = 'searchArticles';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useSearchArticlesByIds = (ids: string[] | number[]) =>
  useQuery({
    queryKey: [QUERY_KEY, ...ids],
    queryFn: async ({queryKey, signal}) => {
      const [_key, ...articleIds] = queryKey;
      const response = await HttpClient.get<ArticleSearchResponse>(
        `https://www.lrt.lt/api/json/search?ids=${articleIds.join(',')}`,
        {
          signal,
        },
      );
      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME,
    enabled: ids.length > 0,
  });
