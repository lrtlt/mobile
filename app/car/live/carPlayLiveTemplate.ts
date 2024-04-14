import {ListTemplate} from 'react-native-carplay';
import {PlayListItem} from '../CarPlayContext';

const createCarPlayLiveTemplate = (items: PlayListItem[], onItemSelect: (item: PlayListItem) => void) => {
  return new ListTemplate({
    title: 'LRT.lt',
    id: 'lrt-list-templates',
    backButtonHidden: true,
    trailingNavigationBarButtons: [
      {
        id: 'reload',
        type: 'text',
        title: 'Atnaujinti',
      },
    ],
    sections: [
      {
        header: 'LRT Gyvai',
        items: items.map((item) => ({
          text: item.text,
          detailText: item.detailText,
          imgUrl: item.imgUrl as any,
        })),
      },
    ],
    onItemSelect: async ({index}) => {
      onItemSelect(items[index]);
    },
  });
};

//TODO: test grid template later if needed
// const createCarPlayGridTemplate = (items: PlayListItem[]) => {
//   return new GridTemplate({
//     buttons: [
//       ...items.map((item) => {
//         const btn: GridButton = {
//           id: item.id.toString(),
//           disabled: true,
//           image: {
//             uri: item.imgUrl,
//             width: 100,
//             height: 100,
//             cache: 'reload',
//           },
//           titleVariants: [item.text, item.detailText],
//         };
//         return btn;
//       }),
//     ],
//   });
// };

export default createCarPlayLiveTemplate;
