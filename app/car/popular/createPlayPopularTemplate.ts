import {ListTemplate} from 'react-native-carplay';

export const carPlayPopularTemplate = new ListTemplate({
  title: 'Populiariausi',
  tabTitle: 'Populiariausi',
  tabSystemImageName: 'star.fill',
  id: 'lrt-list-template-popular',
  trailingNavigationBarButtons: [
    {
      id: 'reload',
      type: 'text',
      title: 'Atnaujinti',
    },
  ],
  sections: [
    {
      items: [],
    },
  ],
  backButtonHidden: true,
});
