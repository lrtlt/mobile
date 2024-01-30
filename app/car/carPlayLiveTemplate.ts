import {ListTemplate} from 'react-native-carplay';
import {PlayListItem} from './CarPlayContext';

const createCarPlayLiveTemplate = (items: PlayListItem[]) => {
  return new ListTemplate({
    title: 'LRT.lt',
    id: 'lrt-list-templates',
    backButtonHidden: true,
    sections: [
      {
        header: 'LRT Gyvai',
        items: items.map((item) => ({
          text: item.text,
          detailText: item.detailText,
          imgUrl: item.imgUrl as any,
          isPlaying: item.isPlaying,
        })),
      },
    ],

    onItemSelect: async ({index}) => {
      console.log('onItemSelect', index);
    },
  });
};

export default createCarPlayLiveTemplate;
