import {ListTemplate} from 'react-native-carplay';

export const TEMPLATE_ID_NEWEST = 'lrt-list-template-newest';

export const carPlayNewestTemplate = new ListTemplate({
  title: 'Naujausi',
  tabTitle: 'Naujausi',
  tabSystemImageName: 'newspaper.fill',
  id: TEMPLATE_ID_NEWEST,
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
