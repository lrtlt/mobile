import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {ArticleContentResponse} from '../Types';

const QUERY_KEY = 'article';

export const useArticle = (articleId?: number | string, isMedia?: boolean) => {
  const url = `https://www.lrt.lt/api/json/article/${articleId}${isMedia ? '?media' : ''}`;
  const urlFallback = `https://www.lrt.lt/api/json/article/${articleId}${!isMedia ? '?media' : ''}`;

  return useQuery({
    queryKey: [QUERY_KEY, articleId],
    queryFn: async ({signal}) => {
      try {
        const response = await get<ArticleContentResponse>(url, {signal});
        if (response.article) {
          return response;
        } else {
          try {
            // Fallback to alternative URL with inverted media flag
            return await get<ArticleContentResponse>(urlFallback, {signal});
          } catch {}
        }
      } catch (e) {
        return await get<ArticleContentResponse>(urlFallback, {signal});
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!articleId,
  });
};
