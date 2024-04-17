import {ListTemplate} from 'react-native-carplay';

export const carPlayRecommendedTemplate = new ListTemplate({
  title: 'Rekomenduojame',
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
