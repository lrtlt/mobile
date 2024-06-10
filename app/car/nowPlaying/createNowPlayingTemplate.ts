import {NowPlayingTemplate} from 'react-native-carplay';

export const carPlayNowPlayingTemplate = new NowPlayingTemplate({
  id: 'lrt-now-playing-template',
  albumArtistButtonEnabled: true,
  onBarButtonPressed: (button) => {
    console.log('onBarButtonPressed', button);
  },
  onButtonPressed: (button) => {
    console.log('onButtonPressed', button);
  },
  onAlbumArtistButtonPressed: () => {
    console.log('onAlbumArtistButtonPressed');
  },
  onUpNextButtonPressed: () => {
    console.log('onUpNextButtonPressed');
  },
});
