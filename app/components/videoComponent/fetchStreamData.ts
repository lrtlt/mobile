import {fetchVideoData} from '../../api';
import {isVideoLiveStream} from '../../api/Types';
import {BASE_IMG_URL} from '../../util/ImageUtil';
import {StreamData} from './useStreamData';

export const fetchStreamData = ({
  url,
  title,
  poster,
  prioritizeAudio,
}: {
  url: string;
  title?: string;
  poster?: string;
  prioritizeAudio?: boolean;
}): Promise<StreamData> =>
  fetchVideoData(url)
    .then((response) => {
      if (isVideoLiveStream(response)) {
        const {data} = response.response;
        return {
          channelTitle: title,
          isLiveStream: true,
          streamUri: prioritizeAudio
            ? data.audio
              ? data.audio.trim()
              : data.content.trim()
            : data.content.trim(),
          title: title ?? 'untitled-live-stream',
          poster: poster,
          mediaId: data.content,
          offset: undefined,
        };
      } else {
        const {playlist_item} = response;
        return {
          channelTitle: title,
          isLiveStream: false,
          streamUri: playlist_item.file.trim(),
          mediaId: playlist_item.mediaid ? playlist_item.mediaid.toString() : 'no-media-id',
          title: response.title,

          offset: response.offset,
          poster: poster ?? playlist_item.image ? BASE_IMG_URL + playlist_item.image : undefined,
        };
      }
    })
    .then((data) => {
      console.log('fetchStreamData', data);
      return data;
    });
