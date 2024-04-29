import {useEffect, useState} from 'react';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {fetchCarPodcasts} from '../../api';
import {CarPlayPodcastItem} from '../../api/Types';

const useCarPlayPodcastsPlaylist = (isConnected: boolean) => {
  const [podcasts, setPodcasts] = useState<CarPlayPodcastItem[]>([]);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    cancellablePromise(
      fetchCarPodcasts(1000).then((data) => {
        if (data.items.length) {
          data.items.forEach((item) => {
            item.title = item.title.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
          });
          data.items.sort((a, b) => a.title.localeCompare(b.title));
          setPodcasts(data.items);
        }
      }),
    );
  }, [isConnected, lastLoadTime]);

  return {
    podcasts,
    reload: () => setLastLoadTime(Date.now()),
  };
};

export default useCarPlayPodcastsPlaylist;
