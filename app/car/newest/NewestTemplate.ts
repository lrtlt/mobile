import {fetchCarNewestPlaylist} from '../../api';
import {PlayListItem} from '../types';
import {BaseListTemplate} from '../BaseListTemplate';

export const TEMPLATE_ID_NEWEST = 'lrt-list-template-newest';

class NewestTemplate extends BaseListTemplate {
  constructor() {
    super(
      {
        title: 'Naujausi',
        tabTitle: 'Naujausi',
        tabSystemImageName: 'newspaper.fill',
        id: TEMPLATE_ID_NEWEST,
      },
      () =>
        fetchCarNewestPlaylist().then((data) => {
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

const instance = new NewestTemplate();
export default instance;
