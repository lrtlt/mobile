import {useMutation, useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import queryClient from '../../../AppQueryClient';
import {useSearchArticlesByIds} from './useSearchArticles';
import {useArticleStorageStore} from '../../state/article_storage_store';
import {isDefaultArticle, isMediaArticle} from '../Types';
import {logEvent, getAnalytics} from '@react-native-firebase/analytics';

const QUERY_KEY = 'favoriteUserArticles';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

type FavoriteArticleResponse = {
  articleId: number;
  createdAt: string;
}[];

export const useFavoriteUserArticleIds = (enabled = true) => {
  return useQuery({
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
    retry: 2,
    enabled: enabled,
  });
};

export const useIsFavoriteUserArticle = (articleId: number, enabled?: boolean) => {
  const {data, ...rest} = useFavoriteUserArticleIds(enabled);
  return {
    data: (data?.findIndex((id) => id === articleId) ?? -1) !== -1,
    ...rest,
  };
};

export const useFavoriteUserArticles = () => {
  const {data} = useFavoriteUserArticleIds();
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
    onMutate: async (articleId: number | string) => {
      // await queryClient.cancelQueries({queryKey: [QUERY_KEY]});
      const previousIds = queryClient.getQueryData([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY], (old: number[]) => old.filter((id) => id !== articleId));
      return {previousIds, articleId};
    },
    onError: (_error, _newArticleId, onMutateResult: any) => {
      queryClient.setQueryData([QUERY_KEY], onMutateResult.previousIds);
    },
    onSuccess: (_, articleId) => {
      logEvent(getAnalytics(), 'app_lrt_lt_article_unfavorited', {
        article_id: articleId,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
    },
  });

export const useAddFavoriteUserArticle = () =>
  useMutation({
    mutationFn: async (articleId: number | string) => {
      console.log('Adding article to favorites');
      const response = await HttpClient.put<{}>(
        `https://www.lrt.lt/servisai/authrz/user/articles/${articleId}`,
      );
      return response.data;
    },
    onMutate: async (articleId: number | string) => {
      // await queryClient.cancelQueries({queryKey: [QUERY_KEY]});
      const previousIds = queryClient.getQueryData([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY], (old: number[]) => [...old, articleId]);

      return {previousIds, newArticleId: articleId};
    },
    onError: (_error, _newArticleId, onMutateResult: any) => {
      queryClient.setQueryData([QUERY_KEY], onMutateResult.previousIds);
    },
    onSuccess: (_data, articleId) => {
      logEvent(getAnalytics(), 'app_lrt_lt_article_favorited', {
        article_id: articleId,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
    },
    retry: 2,
  });

export const useFavoriteArticleSync = () => {
  const {savedArticles, removeArticle} = useArticleStorageStore.getState();
  const addFavoriteArticleMutation = useAddFavoriteUserArticle();

  return useMutation({
    mutationFn: async () => {
      console.log('Article sync started!');
      const mutations = savedArticles.map((article) => {
        if (isMediaArticle(article)) {
          return addFavoriteArticleMutation.mutateAsync(article.id);
        } else if (isDefaultArticle(article)) {
          return addFavoriteArticleMutation.mutateAsync(article.article_id);
        }
      });
      await Promise.all(mutations);
      return savedArticles.length;
    },
    onSuccess: (count) => {
      if (count === 0) {
        console.log('No articles to sync.');
        return;
      }

      console.log('Article sync complete! Articles count:', count);
      savedArticles.forEach((article) => {
        if (isMediaArticle(article)) {
          removeArticle(article.id, true);
        } else if (isDefaultArticle(article)) {
          removeArticle(article.article_id, true);
        }
      });
    },
  });
};
