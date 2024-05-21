import {ListTemplate} from 'react-native-carplay/src';

export const TEMPLATE_ID_LIVE = 'lrt-list-template-live';

export const carPlayLiveTemplate = new ListTemplate({
  title: 'Tiesiogiai',
  tabTitle: 'Tiesiogiai',
  tabSystemImageName: 'play.square.fill',
  id: TEMPLATE_ID_LIVE,
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
