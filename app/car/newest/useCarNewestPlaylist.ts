import {useEffect, useState} from 'react';
import {PlayListItem} from '../CarPlayContext';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {fetchCarNewestPlaylist} from '../../api';

const useCarPlayNewestPlaylist = (isConnected: boolean) => {
  const [channels, setChannels] = useState<PlayListItem[]>([]);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    cancellablePromise(
      fetchCarNewestPlaylist().then((data) => {
        if (data?.length) {
          const channels: PlayListItem[] = data.map((item) => ({
            id: item.title,
            text: item.title,
            detailText: item.content,
            imgUrl: item.cover,
            streamUrl: item.streamUrl,
          }));
          setChannels(channels);
        }
      }),
    );
  }, [isConnected, lastLoadTime]);

  return {
    channels,
    reload: () => setLastLoadTime(Date.now()),
  };
};

export default useCarPlayNewestPlaylist;
