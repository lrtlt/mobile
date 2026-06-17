import {keepPreviousData, useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import {ArticleSearchResponse} from '../Types';

const QUERY_KEY = 'searchArticles';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useSearchArticlesByIds = (ids?: string[] | number[]) =>
  useQuery({
    queryKey: [QUERY_KEY, ...(ids ?? [])],
    queryFn: async ({queryKey, signal}) => {
      const [_key, ...articleIds] = queryKey;

      if (articleIds.length === 0) {
        const result: ArticleSearchResponse = {
          items: [],
        };
        return result;
      }

      const response = await HttpClient.get<ArticleSearchResponse>(
        `https://www.lrt.lt/api/json/search?ids=${articleIds.join(',')}`,
        {
          signal,
        },
      );

      // The search endpoint returns items in its own order (by date), ignoring the
      // order of the requested ids. Callers pass an intentionally-ordered id list
      // (history recency, saved order, recommendation rank), so reorder the items to
      // match the requested ids. Items missing from the response are simply absent.
      const orderById = new Map(articleIds.map((id, index) => [String(id), index]));
      const items = [...response.items].sort(
        (a, b) =>
          (orderById.get(String(a.id)) ?? Number.MAX_SAFE_INTEGER) -
          (orderById.get(String(b.id)) ?? Number.MAX_SAFE_INTEGER),
      );
      return {...response, items};
    },
    enabled: !!ids,
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME,
  });
