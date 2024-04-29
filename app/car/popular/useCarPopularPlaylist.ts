import {useSelector} from 'react-redux';
import {selectHomeChannels} from '../../redux/selectors';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {useEffect, useState} from 'react';
import {PlayListItem} from '../CarPlayContext';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {fetchCarPopularPlaylist} from '../../api';

const useCarPlayPopularPlaylist = (isConnected: boolean) => {
  const [channels, setChannels] = useState<PlayListItem[]>([]);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    cancellablePromise(
      fetchCarPopularPlaylist().then((data) => {
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

export default useCarPlayPopularPlaylist;
