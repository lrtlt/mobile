import {GridTemplate, NowPlayingTemplate} from 'react-native-carplay';

const createCarPlayGridTemplate = () => {
  return new GridTemplate({
    id: 'grid-template',
    buttons: [
      {
        id: 'button-1',
        titleVariants: ['LRT.lt'],
        image: {uri: 'https://picsum.photos/seed/1/100/100'},
      },
      {
        id: 'button-2',
        titleVariants: ['LRT.lt'],
        image: {uri: 'https://picsum.photos/seed/1/100/100'},
      },
      {
        id: 'button-3',
        titleVariants: ['LRT.lt'],
        image: {uri: 'https://picsum.photos/seed/1/100/100'},
      },
      {
        id: 'button-4',
        titleVariants: ['LRT.lt'],
        image: {uri: 'https://picsum.photos/seed/1/100/100'},
      },
    ],
  });
};

export default createCarPlayGridTemplate;
