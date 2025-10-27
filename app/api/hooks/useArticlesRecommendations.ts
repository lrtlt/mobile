import {useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import {ArticleRecommendationsResponse} from '../Types';
import {useSearchArticlesByIds} from './useSearchArticles';

const QUERY_KEY = 'articleRecommendations';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useArticleRecommendations = (articleId: string | number) => {
  const {data} = useQuery({
    queryKey: [QUERY_KEY, articleId],
    queryFn: async ({signal}) => {
      const response = await HttpClient.get<ArticleRecommendationsResponse>(
        `https://peach.ebu.io/api/v1/ltlrt/similar?article_id=${articleId}`,
        {
          signal,
        },
      );
      return response.result;
    },
    staleTime: DEFAULT_STALE_TIME,
  });

  const ids = data?.items?.map((item) => item.id) || [];

  return useSearchArticlesByIds(ids);
};
