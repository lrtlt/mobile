import {ListTemplate} from 'react-native-carplay';

export const TEMPLATE_ID_PODCASTS = 'lrt-list-template-podcasts';

export const carPlayPodcastsTemplate = new ListTemplate({
  title: 'Radijo laidos',
  tabTitle: 'Laidos',
  // tabSystemImageName: 'folder.fill',
  tabSystemImageName: 'circle.grid.3x3.fill',
  id: TEMPLATE_ID_PODCASTS,
  sections: [
    {
      items: [],
    },
  ],
  backButtonHidden: true,
});
