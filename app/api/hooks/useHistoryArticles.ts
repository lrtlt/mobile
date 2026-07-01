import {keepPreviousData, useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import * as HttpClient from '../HttpClient';
import queryClient from '../../../AppQueryClient';
import {searchArticlesByIds, useSearchArticlesByIds} from './useSearchArticles';
import {useArticleStorageStore} from '../../state/article_storage_store';
import {ArticleSearchItem, isMediaArticle} from '../Types';
import {useAuth0} from 'react-native-auth0';

const QUERY_KEY = 'historyUserArticles';
const QUERY_KEY_INFINITE = 'historyUserArticlesInfinite';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

type HistoryArticleResponse = {
  articles: {
    articleId: number;
    added_at: string;
  }[];
};

export const useHistoryUserArticles = (page: number, count?: number) => {
  const {user} = useAuth0();
  const {history} = useArticleStorageStore();
  const localHistoryArticleIds = history.map((item) => (isMediaArticle(item) ? item.id : item.article_id));

  const {data} = useQuery({
    queryKey: [QUERY_KEY, page, count],
    queryFn: async ({signal}) => {
      const response = await HttpClient.get<HistoryArticleResponse>(
        `https://www.lrt.lt/servisai/authrz/user/history/${page}`,
        {
          signal,
        },
      );

      if (count) {
        return response.articles.splice(0, count).map((item) => item.articleId);
      } else {
        return response.articles.map((item) => item.articleId);
      }
    },
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME,
    enabled: !!user,
  });

  // Authenticated users are ordered by the server history list; unauthenticated users
  // by their local store (its only data source).
  const articleIds = HttpClient.isAuthenticated() ? data : localHistoryArticleIds;
  return useSearchArticlesByIds(articleIds);
};

const localHistoryId = (item: ReturnType<typeof useArticleStorageStore.getState>['history'][number]) =>
  isMediaArticle(item) ? item.id : item.article_id;

type HistoryPage = {
  items: ArticleSearchItem[];
  // Raw count of ids in this history page — the end-of-list signal. Judged on ids,
  // NOT on hydrated items, so a page whose ids all fail to hydrate isn't mistaken
  // for the end (see ADR-0002, "Empty-page sentinel").
  idCount: number;
};

/**
 * Infinite (load-more-on-scroll) variant of the reading History list for the
 * History screen. Authenticated users page through the server history; every page
 * fetches its history-id slice and search-hydrates it in one queryFn. Unauthenticated
 * users get their local history as a single terminal page (no "load more"). See ADR-0002.
 */
export const useHistoryUserArticlesInfinite = () => {
  const {user} = useAuth0();
  const {history} = useArticleStorageStore();
  const isAuthenticated = !!user;
  const localHistoryIds = history.map(localHistoryId);

  const query = useInfiniteQuery({
    // Unauthenticated history has no server invalidation to hang off of, so key on the
    // local ids: opening an article reorders the store, changing the key and refetching.
    // Authenticated history stays history-free here (it is invalidated via the mutation).
    queryKey: [QUERY_KEY_INFINITE, isAuthenticated, isAuthenticated ? null : localHistoryIds.join(',')],
    initialPageParam: 1,
    queryFn: async ({pageParam, signal}): Promise<HistoryPage> => {
      if (!isAuthenticated) {
        // Local-only history: a single page of whatever the device stored.
        const response = await searchArticlesByIds(localHistoryIds, signal);
        return {items: response.items, idCount: localHistoryIds.length};
      }

      const response = await HttpClient.get<HistoryArticleResponse>(
        `https://www.lrt.lt/servisai/authrz/user/history/${pageParam}`,
        {signal},
      );
      const ids = response.articles.map((item) => item.articleId);
      const hydrated = await searchArticlesByIds(ids, signal);
      return {items: hydrated.items, idCount: ids.length};
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // Unauthenticated history is a single terminal page.
      if (!isAuthenticated) {
        return undefined;
      }
      // Empty-page sentinel: keep paging until a history page returns no ids.
      return lastPage.idCount > 0 ? lastPageParam + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME,
  });

  // Per-page item arrays in server order. Kept page-by-page (not flattened) so the
  // screen can format each page independently — formatting the whole list at once
  // reflows row grouping across page seams and makes the list visibly jump on append
  // (see ADR-0002).
  const pages = useMemo(() => {
    return (query.data?.pages ?? []).map((page) => page.items);
  }, [query.data]);

  return {
    pages,
    isLoading: query.isLoading,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
  };
};

export const useAddHistoryUserArticle = () =>
  useMutation({
    mutationFn: async (articleId: number | string) => {
      const response = await HttpClient.put<{}>(
        `https://www.lrt.lt/servisai/authrz/user/history/${articleId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // Separate calls: invalidateQueries matches by key prefix, so the two history
      // hooks (keyed [QUERY_KEY, ...] and [QUERY_KEY_INFINITE, ...]) must each be
      // invalidated on their own prefix — a combined [QUERY_KEY, QUERY_KEY_INFINITE]
      // array is a two-element prefix that matches neither.
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEY_INFINITE]});
    },
  });
