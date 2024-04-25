import {ListTemplate} from 'react-native-carplay';

export const carPlayLiveTemplate = new ListTemplate({
  title: 'Tiesiogiai',
  id: 'lrt-list-template-live',
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
