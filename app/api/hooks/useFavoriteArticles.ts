import {useMutation, useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import queryClient from '../../../AppQueryClient';
import {useSearchArticlesByIds} from './useSearchArticles';

const QUERY_KEY = 'favoriteUserArticles';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

type FavoriteArticleResponse = {
  articleId: number;
  createdAt: string;
}[];

export const useFavoriteUserArticles = () => {
  const {data} = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({signal}) => {
      const response = await HttpClient.get<FavoriteArticleResponse>(
        'https://www.lrt.lt/servisai/authrz/user/articles',
        {
          signal,
        },
      );
      return response.map((item) => item.articleId);
    },
    staleTime: DEFAULT_STALE_TIME,
  });

  return useSearchArticlesByIds(data ?? []);
};

export const useDeleteFavoriteUserArticle = () =>
  useMutation({
    mutationFn: async (articleId: number | string) => {
      const response = await HttpClient.del<{}>(
        `https://www.lrt.lt/servisai/authrz/user/articles/${articleId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
    },
  });

export const useAddFavoriteUserArticle = () =>
  useMutation({
    mutationFn: async (articleId: number | string) => {
      const response = await HttpClient.put<{}>(
        `https://www.lrt.lt/servisai/authrz/user/articles/${articleId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
    },
  });
