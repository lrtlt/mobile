import {keepPreviousData, useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import {ArticleSearchResponse} from '../Types';

const QUERY_KEY = 'searchArticles';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

// Plain (non-hook) search-hydration: turns an ordered id list into full articles.
// Extracted so callers outside the React Query hook lifecycle (e.g. an infinite
// query's queryFn) can hydrate ids too. See glossary: "Search-hydration".
export const searchArticlesByIds = async (
  ids: (string | number)[],
  signal?: AbortSignal,
): Promise<ArticleSearchResponse> => {
  if (ids.length === 0) {
    return {items: []};
  }

  const response = await HttpClient.get<ArticleSearchResponse>(
    `https://www.lrt.lt/api/json/search?ids=${ids.join(',')}`,
    {
      signal,
    },
  );

  // The search endpoint returns items in its own order (by date), ignoring the
  // order of the requested ids. Callers pass an intentionally-ordered id list
  // (history recency, saved order, recommendation rank), so reorder the items to
  // match the requested ids. Items missing from the response are simply absent.
  const orderById = new Map(ids.map((id, index) => [String(id), index]));
  const items = [...response.items].sort(
    (a, b) =>
      (orderById.get(String(a.id)) ?? Number.MAX_SAFE_INTEGER) -
      (orderById.get(String(b.id)) ?? Number.MAX_SAFE_INTEGER),
  );
  return {...response, items};
};

export const useSearchArticlesByIds = (ids?: string[] | number[]) =>
  useQuery({
    queryKey: [QUERY_KEY, ...(ids ?? [])],
    queryFn: ({queryKey, signal}) => {
      const [_key, ...articleIds] = queryKey as [string, ...(string | number)[]];
      return searchArticlesByIds(articleIds, signal);
    },
    enabled: !!ids,
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME,
  });
