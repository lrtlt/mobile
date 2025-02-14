import {useEffect, useState} from 'react';
import {fetchCategoryPlaylist} from '../../../api';
import {Article} from '../../../../Types';

const useEpisodes = (categoryId?: number) => {
  const [items, setItems] = useState<Article[]>([]);

  useEffect(() => {
    if (items.length > 0 || !categoryId) {
      return;
    }

    fetchCategoryPlaylist(categoryId).then((response) => {
      if (response.articles) {
        setItems(response.articles);
      }
    });
  }, [categoryId]);

  return {
    episodes: items,
  };
};

export default useEpisodes;
