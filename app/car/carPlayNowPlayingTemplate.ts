import {NowPlayingTemplate} from 'react-native-carplay';

const createCarPlayNowPlayingTemplate = () => {
  return new NowPlayingTemplate({
    id: 'now-playing-template',
    albumArtistButtonEnabled: true,

    // buttons: [
    //   {
    //     id: 'button-1',
    //     type: 'image',
    //     image: {uri: 'https://picsum.photos/seed/1/100/100'},
    //   },
    //   {
    //     id: 'button-2',
    //     type: 'more',
    //   },
    //   {
    //     id: 'button-3',
    //     type: 'playback',
    //   },
    //   {
    //     id: 'button-4',
    //     type: 'add-to-library',
    //   },
    //   {
    //     id: 'button-5',
    //     type: 'repeat',
    //   },
    // ],
    leadingNavigationBarButtons: [
      {
        id: 'leading-button-1',
        title: 'Leading 1',
        type: 'text',
      },
      {
        id: 'leading-button-2',
        title: 'Leading 2',
        type: 'text',
      },
    ],
  });
};

export default createCarPlayNowPlayingTemplate;
