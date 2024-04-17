import {ListTemplate} from 'react-native-carplay';

export const carPlayNewestTemplate = new ListTemplate({
  title: 'Naujausi',
  id: 'lrt-list-template-newest',
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
