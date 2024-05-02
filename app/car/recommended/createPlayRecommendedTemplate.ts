import {ListTemplate} from 'react-native-carplay';

export const carPlayRecommendedTemplate = new ListTemplate({
  title: 'Rekomenduojame',
  tabTitle: 'Siūlome',
  // tabSystemImageName: 'square.grid.3x3.fill',
  tabSystemImageName: 'star.fill',
  id: 'lrt-list-template-Recommended',
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
