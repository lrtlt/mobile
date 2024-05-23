import {ListTemplate} from 'react-native-carplay/src';

export const carPlayCategoryTemplate = new ListTemplate({
  title: 'Laida',
  id: 'lrt-list-template-Category',
  sections: [
    {
      items: [
        {
          text: 'Loading...',
        },
      ],
    },
  ],
  backButtonHidden: true,
});
