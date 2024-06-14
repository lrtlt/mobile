import {fetchCarLivePlaylist} from '../../api';
import {PlayListItem} from '../types';
import {BaseListTemplate} from '../BaseListTemplate';
import {fetchStreamData} from '../../components/videoComponent/fetchStreamData';

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
                // detailText: stream.title,
                image: getImageByChannelId(stream.poster),
                imgUrl: undefined,
                streamUrl: stream.streamUri,
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
      return require('./assets/ic_tv.png');
    }
    case '2': {
      return require('./assets/ic_plius.png');
    }
    case '3': {
      return require('./assets/ic_lituanica.png');
    }
    case '5': {
      return require('./assets/ic_klasika.png');
    }
    case '6': {
      return require('./assets/ic_opus.png');
    }
    default: {
      return require('./assets/ic_radijas.png');
    }
  }
};

const instance = new LiveTemplate();
export default instance;
