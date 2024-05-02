import {ListTemplate} from 'react-native-carplay';

export const carPlayPodcastsTemplate = new ListTemplate({
  title: 'Radijo laidos',
  tabTitle: 'Laidos',
  // tabSystemImageName: 'folder.fill',
  tabSystemImageName: 'circle.grid.3x3.fill',
  id: 'lrt-list-template-podcasts',
  sections: [
    {
      items: [],
    },
  ],
  backButtonHidden: true,
});
