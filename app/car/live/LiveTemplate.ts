import {fetchCarLivePlaylist} from '../../api';
import {PlayListItem} from '../types';
import {BaseListTemplate} from '../BaseListTemplate';
import {fetchStreamData} from '../../components/videoComponent/fetchStreamData';
import {
  SQUARE_LRT_KLASIKA,
  SQUARE_LRT_LITHUANICA,
  SQUARE_LRT_OPUS,
  SQUARE_LRT_PLUS,
  SQUARE_LRT_RADIJAS,
  SQUARE_LRT_TV,
} from '../../constants';

export const TEMPLATE_ID_LIVE = 'lrt-list-template-live';

class LiveTemplate extends BaseListTemplate {
  constructor() {
    super(
      {
        title: 'Tiesiogiai',
        tabTitle: 'Tiesiogiai',
        tabSystemImageName: 'play.square.fill',
        id: TEMPLATE_ID_LIVE,
      },
      () =>
        fetchCarLivePlaylist()
          .then((response) =>
            Promise.all(
              response.tvprog?.items?.map((channel) =>
                fetchStreamData({
                  url: channel.stream_url,
                  title: channel.channel_title,
                  prioritizeAudio: true,
                  //Return channel id as poster so we can map it to the actual image later
                  poster: channel.channel_id.toString(),
                }),
              ) || [],
            ),
          )
          .then((data) => {
            if (data?.length) {
              const items: PlayListItem[] = data.map((stream) => ({
                id: stream.mediaId,
                text: stream.channelTitle ?? stream.title,
                // detailText: stream.isBlocked ? strings.stream_blocked_warning : undefined,
                imgUrl: getImageByChannelId(stream.poster),
                streamUrl: stream.streamUri,
                isDisabled: stream.isBlocked,
                isLiveStream: true,
              }));
              return items;
            }
            return [];
          }),
    );
  }
}

const getImageByChannelId = (channelId?: string) => {
  switch (channelId) {
    case '1': {
      return SQUARE_LRT_TV;
    }
    case '2': {
      return SQUARE_LRT_PLUS;
    }
    case '3': {
      return SQUARE_LRT_LITHUANICA;
    }
    case '5': {
      return SQUARE_LRT_KLASIKA;
    }
    case '6': {
      return SQUARE_LRT_OPUS;
    }
    default: {
      return SQUARE_LRT_RADIJAS;
    }
  }
};

const instance = new LiveTemplate();
export default instance;
