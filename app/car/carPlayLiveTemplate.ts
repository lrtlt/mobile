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
        })),
      },
    ],
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
