import {useEffect, useState} from 'react';
import {fetchRadiotekaSeasonPlaylist} from '../../../api';
import {Article} from '../../../../Types';

const useSeason = (seasonUrl?: string) => {
  const [items, setItems] = useState<Article[]>([]);

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
