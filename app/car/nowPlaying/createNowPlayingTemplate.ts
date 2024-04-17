import {NowPlayingTemplate} from 'react-native-carplay';

export const carPlayNowPlayingTemplate = new NowPlayingTemplate({
  id: 'lrt-now-playing-template',
  // buttons: [
  //   {
  //     id: 'play',
  //     type: 'image',
  //     image: {
  //       uri: 'https://i.imgur.com/SOzyBsf.jpeg',
  //     },
  //   },
  //   {
  //     id: 'test',
  //     type: 'more',
  //   },
  // ],
  onButtonPressed: ({id, templateId}) => {
    console.log('Button pressed', id, templateId);
  },

  tabTitle: 'Dabar grojama',
  albumArtistButtonEnabled: true,
});
