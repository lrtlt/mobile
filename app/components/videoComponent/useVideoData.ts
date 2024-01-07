import {useCallback, useEffect, useState} from 'react';
import {fetchVideoData} from '../../api';
import {isVideoLiveStream} from '../../api/Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {BASE_IMG_URL} from '../../util/ImageUtil';

export type StreamData = {
  isLiveStream: boolean;
  streamUri: string;
  mediaId: string;
  title: string;
  offset?: number;
  poster?: string;
};

type VideoState = {
  isLoading: boolean;
  data?: StreamData;
};

type ReturnState = VideoState & {
  load: (url: string, title: string) => void;
};

const useVideoData = (cache?: StreamData): ReturnState => {
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
      cancellablePromise(fetchVideoData(url)).then((response) => {
        if (isVideoLiveStream(response)) {
          const {data} = response.response;

          setState({
            isLoading: false,
            data: {
              isLiveStream: true,
              streamUri: data.content.trim(),
              title: title ?? 'untitled-live-stream',
              mediaId: data.content,
              offset: undefined,
            },
          });
        } else {
          const {playlist_item} = response;
          setState({
            isLoading: false,
            data: {
              isLiveStream: false,
              streamUri: playlist_item.file.trim(),
              mediaId: playlist_item.mediaid ? playlist_item.mediaid.toString() : 'no-media-id',
              title: response.title,
              offset: response.offset,
              poster: playlist_item.image ? BASE_IMG_URL + playlist_item.image : undefined,
            },
          });
        }
      });
    },
    [cancellablePromise],
  );

  return {
    ...state,
    load,
  };
};

export default useVideoData;
