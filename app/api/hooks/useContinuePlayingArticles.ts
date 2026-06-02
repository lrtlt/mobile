import {useMemo} from 'react';
import {usePlaybackProgress} from './usePlaybackProgress';
import {useSearchArticlesByIds} from './useSearchArticles';
import {ArticleSearchItem} from '../Types';
import {PLAYBACK_PROGRESS_MAX_ENTRIES} from '../../constants';

/**
 * Combined "continue playing" list across video + audio.
 *
 * The remote watch-history endpoint is per-mediaType, so we run two
 * usePlaybackProgress queries, merge their entries by recency (updatedAt desc),
 * then resolve article metadata via search. The returned articles preserve the
 * playback recency order.
 */
export const useContinuePlayingArticles = (count?: number) => {
  const fetchCount = count ?? PLAYBACK_PROGRESS_MAX_ENTRIES;

  const video = usePlaybackProgress({mediaType: 'video', count: fetchCount});
  const audio = usePlaybackProgress({mediaType: 'audio', count: fetchCount});

  const entries = useMemo(() => {
    const merged = [...(video.data ?? []), ...(audio.data ?? [])].sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
    return count != null ? merged.slice(0, count) : merged;
  }, [video.data, audio.data, count]);

  const articleIds = useMemo(() => entries.map((e) => e.articleId), [entries]);

  const search = useSearchArticlesByIds(articleIds.length > 0 ? articleIds : undefined);

  const articles = useMemo<ArticleSearchItem[]>(() => {
    const byId = new Map(search.data?.items?.map((item) => [item.id, item]));
    return entries
      .map((entry) => byId.get(entry.articleId))
      .filter((article): article is ArticleSearchItem => Boolean(article));
  }, [entries, search.data]);

  return {
    articles,
    isLoading: (video.isPending || audio.isPending || search.isPending) && articles.length === 0,
    error: video.error ?? audio.error ?? search.error,
  };
};
