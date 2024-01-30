import {ListTemplate} from 'react-native-carplay';

const createCarPlayListTemplate = () => {
  return new ListTemplate({
    title: 'LRT.lt',
    id: 'lrt-list-templates',
    backButtonHidden: true,
    // leadingNavigationBarButtons: [
    //   {
    //     id: 'leading-button-1',
    //     title: 'Leading 1',
    //     type: 'text',
    //   },
    //   {
    //     id: 'leading-button-2',
    //     title: 'Leading 2',
    //     type: 'text',
    //   },
    // ],
    sections: [
      {
        header: 'LRT Gyvai',
        items: [
          {
            text: 'Item one',
            detailText: 'Detail text',
            showsDisclosureIndicator: false,
            imgUrl: 'https://picsum.photos/seed/1/100/100' as any,
            isPlaying: false,
          },
          {
            text: 'Item 2',
            detailText: 'Detail text',
            isPlaying: false,
            imgUrl: 'https://picsum.photos/seed/2/100/100' as any,
          },
          {
            text: 'Item 3',
            detailText: 'Detail text',
            isPlaying: false,
            imgUrl: 'https://picsum.photos/seed/3/100/100' as any,
          },
        ],
      },
    ],

    onItemSelect: async ({index}) => {
      console.log('onItemSelect', index);
    },
  });
};

export default createCarPlayListTemplate;
