import {useCallback, useEffect, useState} from 'react';
import {fetchMediatekaSeasonPlaylist, fetchRadiotekaSeasonPlaylist} from '../../../api';
import {Article} from '../../../../Types';

const ITEMS_PER_PAGE = 20;

const useSeason = (
  seasonUrl?: string,
  preloaded?: Article[],
  isVodcast?: boolean,
  pageSize = ITEMS_PER_PAGE,
) => {
  const [items, setItems] = useState<Article[]>(preloaded ? preloaded : []);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(!!seasonUrl);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!seasonUrl) {
      return;
    }
    //Load first page
    loadPage(1);
  }, [seasonUrl]);

  const loadPage = useCallback(
    (pageNumber: number) => {
      if (!seasonUrl) {
        return;
      }

      const api = isVodcast ? fetchMediatekaSeasonPlaylist : fetchRadiotekaSeasonPlaylist;

      api(seasonUrl, pageNumber, pageSize).then((response) => {
        if (response.items) {
          setPage(response.page);

          let newItems = response.items;
          if (response.page > 1) {
            newItems = items.concat(response.items);
          }
          setItems(newItems);
          setHasMoreEpisodes(response.items.length >= pageSize);
          console.log(`Season page ${response.page}:', items: ${response.items.length}`);
          console.log('Total items:', newItems.length);
        }
      });
    },
    [items, seasonUrl],
  );

  const loadNextPage = useCallback(() => {
    if (hasMoreEpisodes) {
      loadPage(page + 1);
    } else {
      console.log('No more episodes to load');
    }
  }, [hasMoreEpisodes, loadPage, page]);

  return {
    episodes: items,
    hasMore: hasMoreEpisodes,
    loadMoreEpisodes: loadNextPage,
  };
};

const useAllSeasonEpisodes = (seasonUrl?: string, isVodcast?: boolean) => {
  const [items, setItems] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!seasonUrl) {
      return;
    }

    const fetchAllEpisodes = async () => {
      setIsLoading(true);
      setError(null);

      const api = isVodcast ? fetchMediatekaSeasonPlaylist : fetchRadiotekaSeasonPlaylist;
      const MAX_PAGE_SIZE = 100;
      let allItems: Article[] = [];
      let currentPage = 1;
      let hasMore = true;

      try {
        while (hasMore) {
          const response = await api(seasonUrl, currentPage, MAX_PAGE_SIZE);

          if (response.items && response.items.length > 0) {
            allItems = allItems.concat(response.items);
            hasMore = response.items.length >= MAX_PAGE_SIZE;
            currentPage++;
          } else {
            hasMore = false;
          }
        }

        setItems(allItems);
        console.log(`Loaded all episodes: ${allItems.length} total`);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch episodes'));
        console.error('Error fetching all episodes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEpisodes();
  }, [seasonUrl, isVodcast]);

  return {
    episodes: items,
    isLoading,
    error,
  };
};

export default useSeason;
export {useAllSeasonEpisodes};
