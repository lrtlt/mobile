import {useCallback, useEffect, useState} from 'react';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {fetchStreamData} from './fetchStreamData';
import {MediaType} from './context/PlayerContext';
import {VideoTextTrack} from '../../api/Types';

export type StreamData = {
  channelTitle?: string;
  isLiveStream: boolean;
  streamUri: string;
  mediaId: string;
  title: string;
  offset?: number;
  poster?: string;
  mediaType?: MediaType;
  tracks?: VideoTextTrack[];
};

type VideoState = {
  isLoading: boolean;
  data?: StreamData;
};

type ReturnState = VideoState & {
  load: (url: string, title: string) => void;
};

const useStreamData = (cache?: StreamData): ReturnState => {
  const [state, setState] = useState<VideoState>({
    data: cache,
    isLoading: false,
  });

  useEffect(() => {
    if (cache) {
      setState({
        isLoading: false,
        data: cache,
      });
    }
  }, [cache]);

  const cancellablePromise = useCancellablePromise();

  const load = useCallback(
    (url: string, title: string) => {
      setState({isLoading: true});
      cancellablePromise(fetchStreamData({url, title})).then((response) => {
        setState({
          isLoading: false,
          data: response,
        });
      });
    },
    [cancellablePromise],
  );

  return {
    ...state,
    load,
  };
};

export default useStreamData;
