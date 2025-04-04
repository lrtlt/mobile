import {useEffect, useState} from 'react';
import {fetchRadiotekaSeasonPlaylist} from '../../../api';
import {Article} from '../../../../Types';

const useSeason = (seasonUrl?: string, preloaded?: Article[]) => {
  const [items, setItems] = useState<Article[]>(preloaded ? preloaded : []);

  useEffect(() => {
    if (!seasonUrl) {
      return;
    }

    setItems([]);
    fetchRadiotekaSeasonPlaylist(seasonUrl).then((response) => {
      if (response.items) {
        setItems(response.items);
      }
    });
  }, [seasonUrl]);

  return {
    episodes: items,
  };
};

export default useSeason;
