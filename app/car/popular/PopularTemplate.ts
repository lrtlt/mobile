import {fetchCarPopularPlaylist} from '../../api';
import {PlayListItem} from '../types';
import {BaseListTemplate} from '../BaseListTemplate';

export const TEMPLATE_ID_POPULAR = 'lrt-list-template-popular';

class PopularTemplate extends BaseListTemplate {
  constructor() {
    super(
      {
        title: 'Populiariausi',
        tabTitle: 'Populiariausi',
        tabSystemImageName: 'star.fill',
        id: TEMPLATE_ID_POPULAR,
      },
      () =>
        fetchCarPopularPlaylist().then((data) => {
          if (data?.length) {
            const channels: PlayListItem[] = data.map((item) => ({
              id: item.title,
              text: item.title,
              detailText: item.content,
              imgUrl: item.cover,
              streamUrl: item.streamUrl,
            }));
            return channels;
          }
          return [];
        }),
    );
  }
}

const instance = new PopularTemplate();
export default instance;
