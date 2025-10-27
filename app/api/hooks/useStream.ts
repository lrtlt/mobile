import {useQuery} from '@tanstack/react-query';
import {isVideoLiveStream, VideoDataDefault, VideoDataLiveStream, VideoTextTrack} from '../Types';
import {get} from '../HttpClient';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';
import {BLOCKED_STREAM_URL} from '../../constants';
import {BASE_IMG_URL} from '../../util/ImageUtil';

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
  isBlocked?: boolean;
};

type Props = {
  streamUrl?: string;
  title?: string;
  poster?: string;
  initialData?: StreamData;
};

export const useStreamInfo = (props: Props) => {
  const {streamUrl, title, poster, initialData} = props;

  return useQuery({
    queryKey: ['streamInfo', streamUrl, title, poster, initialData],
    queryFn: async ({signal}) => {
      const response = await get<VideoDataLiveStream | VideoDataDefault>(streamUrl!, {
        signal,
      });

      if (isVideoLiveStream(response)) {
        const {data} = response.response;
        const isBlocked = !!data.restriction;
        const streamData: StreamData = {
          channelTitle: title,
          isLiveStream: true,
          streamUri: isBlocked ? BLOCKED_STREAM_URL : data.content.trim(),
          title: title ?? 'untitled-live-stream',
          poster: poster,
          mediaId: data.content,
          offset: undefined,
          isBlocked: isBlocked,
        };
        return streamData;
      } else {
        const {playlist_item} = response;
        const streamData: StreamData = {
          channelTitle: title,
          isLiveStream: false,
          streamUri: playlist_item.file.trim(),
          mediaId: playlist_item.mediaid ? playlist_item.mediaid.toString() : 'no-media-id',
          title: response.title,
          offset: response.offset,
          poster: poster ?? playlist_item.image ? BASE_IMG_URL + playlist_item.image : undefined,
          isBlocked: false,
          tracks: playlist_item.tracks?.map((track) => ({
            ...track,
            src: track.src.startsWith('http') ? track.src : BASE_IMG_URL + track.src,
            srclang: track.srclang ?? 'lt',
          })),
        };
        return streamData;
      }
    },
    retry: 2,
    initialData: initialData,
    enabled: !!streamUrl,
  });
};
