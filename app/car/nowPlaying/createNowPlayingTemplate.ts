import {NowPlayingTemplate} from 'react-native-carplay';

type Props = {
  onNextPress: () => void;
  onPreviousPress: () => void;
};

export const createNowPlayingTemplate = ({onNextPress, onPreviousPress}: Props) => {
  return new NowPlayingTemplate({
    id: 'lrt-now-playing-template',
    onButtonPressed: (button) => {
      if (button.id === 'next') {
        onNextPress();
      } else if (button.id === 'previous') {
        onPreviousPress();
      }
    },
    albumArtistButtonEnabled: true,
    buttons: [
      {
        id: 'previous',
        type: 'image',
        image: require('./assets/backward-solid.png'),
      },
      {
        id: 'next',
        type: 'image',
        image: require('./assets/forward-solid.png'),
      },
    ],
  });
};
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
