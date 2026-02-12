import {useMemo} from 'react';
import {useHistoryUserArticles} from './useHistoryArticles';

export type HistoryCategory = {
  id: number;
  title: string;
};

/**
 * Extracts unique categories from video/audio articles in the user's history.
 * Returns up to 10 categories from articles that are video or audio content.
 * Excludes categories that are already in the existingSubscriptions list.
 */
export const useHistoryCategories = (maxCategories: number = 10, existingSubscriptionKeys?: string[]) => {
  const {data: historyData, isLoading, isError} = useHistoryUserArticles(1, 50);

  const categories = useMemo(() => {
    if (!historyData?.items) return [];

    const videoAudioArticles = historyData.items.filter(
      (article) => article.is_video === 1 || article.is_audio === 1,
    );

    const categoryMap = new Map<number, HistoryCategory>();
    for (const article of videoAudioArticles) {
      if (categoryMap.size >= maxCategories) break;
      if (article.category_id && article.category_title && !categoryMap.has(article.category_id)) {
        // Skip if this category is already in existing subscriptions
        const subscriptionKey = `category-${article.category_id}`;
        if (existingSubscriptionKeys?.includes(subscriptionKey)) {
          continue;
        }
        categoryMap.set(article.category_id, {id: article.category_id, title: article.category_title});
      }
    }

    return Array.from(categoryMap.values());
  }, [historyData, maxCategories, existingSubscriptionKeys]);

  return {
    categories,
    isLoading,
    isError,
  };
};
