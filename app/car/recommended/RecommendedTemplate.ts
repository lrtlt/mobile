import {fetchCarRecommendedPlaylist} from '../../api';
import {PlayListItem} from '../types';
import {BaseListTemplate} from '../BaseListTemplate';

export const TEMPLATE_ID_RECOMMENDED = 'lrt-list-template-recommended';

class RecommendedTemplate extends BaseListTemplate {
  constructor() {
    super(
      {
        title: 'Rekomenduojame',
        tabTitle: 'Siūlome',
        tabSystemImageName: 'star.fill',
        id: TEMPLATE_ID_RECOMMENDED,
      },
      fetchCarRecommendedPlaylist().then((data) => {
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

const instance = new RecommendedTemplate();
export default instance;
