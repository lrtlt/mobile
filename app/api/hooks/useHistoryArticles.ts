import {keepPreviousData, useMutation, useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import queryClient from '../../../AppQueryClient';
import {useSearchArticlesByIds} from './useSearchArticles';
import {useArticleStorageStore} from '../../state/article_storage_store';
import {isMediaArticle} from '../Types';

const QUERY_KEY = 'historyUserArticles';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

type HistoryArticleResponse = {
  articles: {
    articleId: number;
    added_at: string;
  }[];
};

export const useHistoryUserArticles = (page: number) => {
  const {history} = useArticleStorageStore();
  const localHistoryArticleIds = history.map((item) => (isMediaArticle(item) ? item.id : item.article_id));

  const {data} = useQuery({
    queryKey: [QUERY_KEY, page],
    queryFn: async ({signal}) => {
      const response = await HttpClient.get<HistoryArticleResponse>(
        `https://www.lrt.lt/servisai/authrz/user/history/${page}`,
        {
          signal,
        },
      );
      return response.articles.map((item) => item.articleId);
    },
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME,
  });

  const articleIds = HttpClient.isAuthenticated() ? data ?? [] : localHistoryArticleIds;
  return useSearchArticlesByIds(articleIds);
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
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
    },
  });
