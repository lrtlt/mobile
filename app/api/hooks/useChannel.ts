import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {ChannelResponse, isVideoLiveStream, VideoDataDefault, VideoDataLiveStream} from '../Types';
import {StreamData} from '../../components/videoComponent/useStreamData';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';
import {LRT_KLASIKA, LRT_LITHUANICA, LRT_OPUS, LRT_PLUS, LRT_RADIJAS, LRT_TV} from '../../constants';

export const useChannelById = (id: number | string) => {
  return useQuery({
    queryKey: ['channel', id],
    queryFn: async ({signal}) => {
      const response = await get<ChannelResponse>(`https://www.lrt.lt/api/json/tv/channel/${id}`, {
        signal,
      });
      return response;
    },
    staleTime: 1000 * 60 * 2, // 1 minutes
    refetchInterval: 1000 * 60 * 2, // 1 minutes
  });
};

export const useChannelStreamInfo = (channelId: number | string) => {
  const {data: channelResponse} = useChannelById(channelId);

  return useQuery({
    queryKey: ['channelStreamInfo', channelResponse?.channel_info.get_streams_url ?? '-'],
    queryFn: async ({signal, queryKey}) => {
      const [_key, url] = queryKey;

      const response = await get<VideoDataLiveStream | VideoDataDefault>(url, {
        signal,
      });

      if (isVideoLiveStream(response)) {
        const {data} = response.response;
        const streamData: StreamData = {
          channelTitle: channelResponse?.channel_info.channel,
          isLiveStream: true,
          streamUri: data.content.trim(),
          title: channelResponse?.channel_info?.title ?? 'untitled-live-stream',
          mediaId: data.content,
          mediaType: MediaType.VIDEO,
          offset: undefined,
        };

        let audioStreamData: StreamData | undefined;
        if (data.audio) {
          audioStreamData = {
            ...streamData,
            streamUri: data.audio.trim(),
            mediaType: MediaType.AUDIO,
            poster: getPosterByChannelId(String(channelId)),
          };
        }

        return {
          channelData: channelResponse,
          streamData,
          audioStreamData,
        };
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: keepPreviousData,
    enabled: !!channelResponse,
  });
};

const getPosterByChannelId = (channelId: string) => {
  switch (channelId) {
    case '1': {
      return LRT_TV;
    }
    case '2': {
      return LRT_PLUS;
    }
    case '3': {
      return LRT_LITHUANICA;
    }
    case '5': {
      return LRT_KLASIKA;
    }
    case '6': {
      return LRT_OPUS;
    }
    default: {
      return LRT_RADIJAS;
    }
  }
};
