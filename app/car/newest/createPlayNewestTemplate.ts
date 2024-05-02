import {ListTemplate} from 'react-native-carplay';

export const carPlayNewestTemplate = new ListTemplate({
  title: 'Naujausi',
  tabTitle: 'Naujausi',
  tabSystemImageName: 'newspaper.fill',
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
