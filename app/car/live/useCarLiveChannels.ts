import {useEffect, useState} from 'react';
import {PlayListItem} from '../CarPlayContext';
import {fetchStreamData} from '../../components/videoComponent/fetchStreamData';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import {fetchCarLivePlaylist} from '../../api';
import {BASE_IMG_URL} from '../../util/ImageUtil';

const useCarLiveChannels = (isConnected: boolean) => {
  const [channels, setChannels] = useState<PlayListItem[]>([]);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    cancellablePromise(
      fetchCarLivePlaylist().then((response) =>
        Promise.all(
          response.tvprog?.items?.map((channel) =>
            fetchStreamData({
              url: channel.stream_url,
              title: channel.channel_title,
              poster: channel.cover_url.startsWith('http')
                ? channel.cover_url
                : BASE_IMG_URL + channel.cover_url,
            }),
          ) || [],
        ),
      ),
    ).then((data) => {
      if (data?.length) {
        const channels: PlayListItem[] = data.map((stream) => ({
          id: stream.mediaId,
          text: stream.channelTitle ?? stream.title,
          // detailText: stream.title,
          imgUrl: stream.poster || VIDEO_DEFAULT_BACKGROUND_IMAGE,
          streamUrl: stream.streamUri,
        }));
        setChannels(channels);
      }
    });
  }, [isConnected, lastLoadTime]);

  return {
    channels,
    reload: () => setLastLoadTime(Date.now()),
  };
};

export default useCarLiveChannels;
