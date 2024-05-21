import {ListTemplate} from 'react-native-carplay/src';

export const TEMPLATE_ID_POPULAR = 'lrt-list-template-popular';

export const carPlayPopularTemplate = new ListTemplate({
  title: 'Populiariausi',
  tabTitle: 'Populiariausi',
  tabSystemImageName: 'star.fill',
  id: TEMPLATE_ID_POPULAR,
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
