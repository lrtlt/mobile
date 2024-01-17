import {ListTemplate} from 'react-native-carplay';

const createCarListTemplate = () => {
  return new ListTemplate({
    title: 'Hello, LRT',
    id: 'lrt-list-template',
    actions: [
      {
        title: 'MY ACTION',
        enabled: true,
        type: 'custom',
        id: 'myAction',
      },
    ],
    items: [
      {
        id: 'item-11',
        text: 'Item one',
        detailText: 'Detail text',
        action: {
          title: 'PLAY',
          id: 'play',
          enabled: true,
          type: 'custom',
          backgroundColor: '#ffffffff',
          visibility: 'persistent',
        },
        browsable: true,
        showsDisclosureIndicator: true,
        toggle: 1,
        image: {uri: 'https://picsum.photos/seed/1/100/100'},
        isPlaying: true,
        enabled: true,
      },
      {
        id: 'item-2',
        text: 'Item 2',
        enabled: false,
        detailText: 'Detail text',
        image: {uri: 'https://picsum.photos/seed/2/100/100'},
        isPlaying: false,
      },
      {
        id: 'item-3',
        text: 'Item 3',
        detailText: 'Detail text',
        image: {uri: 'https://picsum.photos/seed/3/100/100'},
        isPlaying: false,
      },
    ],
    onItemSelect: async ({index}) => {
      console.log('onItemSelect', index);
    },
  });
};

export default createCarListTemplate;
