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
