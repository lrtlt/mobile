import {ListTemplate} from 'react-native-carplay';

export const carPlayEmptyTemplate = new ListTemplate({
  id: 'lrt-empty-template',
  backButtonHidden: true,
  emptyViewSubtitleVariants: ['Prašome palaukti...'],
  sections: [
    {
      items: [],
    },
  ],
});
