import {useCallback, useEffect, useState} from 'react';
import {fetchRadiotekaSeasonPlaylist} from '../../../api';
import {Article} from '../../../../Types';

const ITEMS_PER_PAGE = 20;

const useSeason = (seasonUrl?: string, preloaded?: Article[]) => {
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

      fetchRadiotekaSeasonPlaylist(seasonUrl, pageNumber, ITEMS_PER_PAGE).then((response) => {
        if (response.items) {
          setPage(response.page);

          let newItems = response.items;
          if (response.page > 1) {
            newItems = items.concat(response.items);
          }
          setItems(newItems);
          setHasMoreEpisodes(response.items.length >= ITEMS_PER_PAGE);
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

export default useSeason;
