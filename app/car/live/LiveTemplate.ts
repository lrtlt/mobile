import {fetchCarLivePlaylist} from '../../api';
import {PlayListItem} from '../types';
import {BaseListTemplate} from '../BaseListTemplate';
import {VIDEO_DEFAULT_BACKGROUND_IMAGE} from '../../constants';
import {fetchStreamData} from '../../components/videoComponent/fetchStreamData';
import {BASE_IMG_URL} from '../../util/ImageUtil';

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
      fetchCarLivePlaylist()
        .then((response) =>
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
        )
        .then((data) => {
          if (data?.length) {
            const items: PlayListItem[] = data.map((stream) => ({
              id: stream.mediaId,
              text: stream.channelTitle ?? stream.title,
              // detailText: stream.title,
              imgUrl: stream.poster || VIDEO_DEFAULT_BACKGROUND_IMAGE,
              streamUrl: stream.streamUri,
            }));
            return items;
          }
          return [];
        }),
    );
  }
}

const instance = new LiveTemplate();
export default instance;
