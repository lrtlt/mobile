import {AlertTemplate, CarPlay} from 'react-native-carplay';
import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';
import TrackPlayer from 'react-native-track-player';
import {setupTrackPlayer} from './useTrackPlayerSetup';

import RootTemplate from './root/RootTemplate';

CarPlay.emitter.addListener('didConnect', async () => {
  console.log('### CarPlay connected');
  Gemius.sendPageViewedEvent('carplay_connected');
  analytics().logEvent('carplay_connected');
  setupTrackPlayer();

  CarPlay.presentTemplate(
    new AlertTemplate({
      id: 'loading-alert',
      titleVariants: ['Prašome palaukti...'],
    }),
  );
  const rootTemplate = await RootTemplate.build();
  CarPlay.dismissTemplate();
  CarPlay.setRootTemplate(rootTemplate);
  CarPlay.enableNowPlaying(true);
});

CarPlay.emitter.addListener('didDisconnect', () => {
  console.log('### CarPlay disconnected');
  Gemius.sendPageViewedEvent('carplay_disconnected');
  analytics().logEvent('carplay_disconnected');
  TrackPlayer.reset();
});

CarPlay.emitter.addListener('backButtonPressed', () => {
  console.log('### Back button pressed');
  CarPlay.popTemplate();
});
