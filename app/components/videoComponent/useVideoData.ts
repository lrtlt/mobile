import {useCallback, useState} from 'react';
import {fetchVideoData} from '../../api';
import {isVideoLiveStream} from '../../api/Types';

type VideoState = {
  isLoading: boolean;
  data?: {
    isLiveStream: boolean;
    streamUri: string;
    mediaId: string;
    title: string;
    offset?: number;
  };
};

type ReturnState = VideoState & {
  load: (url: string, title: string) => void;
};

const useVideoData = (): ReturnState => {
  const [state, setState] = useState<VideoState>({
    isLoading: false,
  });

  const load = useCallback((url: string, title: string) => {
    setState({isLoading: true});
    fetchVideoData(url).then((response) => {
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
          },
        });
      }
    });
  }, []);

  return {
    ...state,
    load,
  };
};

export default useVideoData;
