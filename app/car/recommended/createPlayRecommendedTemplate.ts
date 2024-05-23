import {ListTemplate} from 'react-native-carplay/src';

export const TEMPLATE_ID_RECOMMENDED = 'lrt-list-template-recommended';

export const carPlayRecommendedTemplate = new ListTemplate({
  title: 'Rekomenduojame',
  tabTitle: 'Siūlome',

  // tabSystemImageName: 'square.grid.3x3.fill',
  tabSystemImageName: 'star.fill',
  id: TEMPLATE_ID_RECOMMENDED,
  trailingNavigationBarButtons: [
    {
      id: 'reload',
      type: 'text',
      title: 'Atnaujinti',
    },
  ],
  items: [
    {
      text: 'Loading...',
    },
  ],
  backButtonHidden: true,
});
