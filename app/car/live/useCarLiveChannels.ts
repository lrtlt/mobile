import {useSelector} from 'react-redux';
import {selectHomeChannels} from '../../redux/selectors';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {useEffect, useState} from 'react';
import {PlayListItem} from '../CarPlayContext';
import {fetchStreamData} from '../../components/videoComponent/fetchStreamData';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';

const useCarLiveChannels = (isActive: boolean) => {
  const [channels, setChannels] = useState<PlayListItem[]>([]);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);
  const channelsData = useSelector(selectHomeChannels, checkEqual);

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (!isActive) {
      return;
    }

    cancellablePromise(
      Promise.all(
        channelsData?.channels?.map((channel) =>
          fetchStreamData({
            url: channel.get_streams_url,
            title: channel.channel_title,
            poster: channel.cover_url,
          }),
        ) || [],
      ),
    ).then((data) => {
      if (data?.length) {
        const channels: PlayListItem[] = data.map((stream) => ({
          id: stream.mediaId,
          text: stream.channelTitle ?? stream.title,
          // detailText: 'stream.title',
          imgUrl: stream.poster || VIDEO_DEFAULT_BACKGROUND_IMAGE,
          streamUrl: stream.streamUri,
        }));
        setChannels(channels);
      }
    });
  }, [channelsData, isActive, lastLoadTime]);

  return {
    channels,
    reload: () => setLastLoadTime(Date.now()),
  };
};

export default useCarLiveChannels;
