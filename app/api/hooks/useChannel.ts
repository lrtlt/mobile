import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {ChannelResponse, isVideoLiveStream, VideoDataDefault, VideoDataLiveStream} from '../Types';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';
import {BLOCKED_STREAM_URL} from '../../constants';
import {StreamData} from './useStream';
import {getPosterByChannelId} from '../../util/UI';

export const useChannelById = (id: number | string) => {
  return useQuery({
    queryKey: ['channel', id],
    queryFn: async ({signal}) => {
      const response = await get<ChannelResponse>(`https://www.lrt.lt/api/json/tv/channel/${id}`, {
        signal,
      });
      return response;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useChannelStreamInfo = (channelId: number | string) => {
  const {data: channelResponse} = useChannelById(channelId);

  return useQuery({
    queryKey: ['channelStreamInfo', channelResponse?.channel_info?.get_streams_url ?? '-'],
    queryFn: async ({signal, queryKey}) => {
      const [_key, url] = queryKey;

      const response = await get<VideoDataLiveStream | VideoDataDefault>(url, {
        signal,
      });

      if (isVideoLiveStream(response)) {
        const {data} = response.response;
        const isBlocked = !!data.restriction;
        const streamData: StreamData = {
          channelTitle: channelResponse?.channel_info?.channel,
          isLiveStream: true,
          streamUri: isBlocked ? BLOCKED_STREAM_URL : data.content.trim(),
          title: channelResponse?.channel_info?.title ?? 'untitled-live-stream',
          mediaId: data.content,
          mediaType: MediaType.VIDEO,
          offset: undefined,
        };

        let audioStreamData: StreamData | undefined;
        if (data.audio) {
          audioStreamData = {
            ...streamData,
            streamUri: isBlocked ? BLOCKED_STREAM_URL : data.audio.trim(),
            mediaId: data.audio,
            mediaType: MediaType.AUDIO,
            poster: getPosterByChannelId(String(channelId)),
          };
        }

        return {
          channelData: channelResponse,
          streamData,
          audioStreamData,
        };
      } else {
        throw new Error('Channel stream is not a live stream');
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: keepPreviousData,
    enabled: !!channelResponse,
  });
};
