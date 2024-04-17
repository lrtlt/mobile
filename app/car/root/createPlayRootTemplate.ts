import {ListTemplate} from 'react-native-carplay';

export const CATEGORY_LIVE = 0;
export const CATEGORY_RECOMMENDED = 1;
export const CATEGORY_POPULAR = 2;
export const CATEGORY_NEWEST = 3;

export const carPlayRootTemplate = new ListTemplate({
  title: 'LRT.lt',
  id: 'lrt-root-template',
  backButtonHidden: true,
  sections: [
    {
      // header: 'Lrt.lt',
      items: [
        {
          // imgUrl: 'https://www.lrt.lt/img/2023/10/10/1604829-889266-615x345.jpg' as any,
          text: 'Tiesiogiai',
        },
        {
          text: 'Rekomenduojame',
        },
        {
          text: 'Populiariausi',
        },
        {
          text: 'Naujausi',
        },
      ],
    },
  ],
});
