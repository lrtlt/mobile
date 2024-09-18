import {AlertTemplate, CarPlay} from 'react-native-carplay';
import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';
import TrackPlayer, {State} from 'react-native-track-player';
import {setupTrackPlayer} from './useTrackPlayerSetup';

import RootTemplate from './root/RootTemplate';
import {carPlayNowPlayingTemplate} from './nowPlaying/createNowPlayingTemplate';
import {debounce} from 'lodash';

let isPlayerWaitingToResume = false;

const DEBOUNCE_TIME = 1000;

const trackConnected = debounce(() => {
  Gemius.sendPageViewedEvent('carplay_connected');
  analytics().logEvent('carplay_connected');
}, DEBOUNCE_TIME * 2);

const trackDisconnected = debounce(() => {
  Gemius.sendPageViewedEvent('carplay_disconnected');
  analytics().logEvent('carplay_disconnected');
}, DEBOUNCE_TIME * 2);

CarPlay.emitter.addListener('didConnect', async () => {
  console.log('### CarPlay connected');
  trackConnected();
  await setupTrackPlayer();

  CarPlay.presentTemplate(
    new AlertTemplate({
      id: 'loading-alert',
      titleVariants: ['Prašome palaukti...'],
    }),
  );

  try {
    const rootTemplate = await RootTemplate.build();
    CarPlay.dismissTemplate();
    CarPlay.setRootTemplate(rootTemplate);
    CarPlay.enableNowPlaying(true);
  } catch (e) {
    analytics().logEvent('carplay_connection_error', {error: e});
    console.log(e);
  }

  resumePlayback();
});

const resumePlayback = debounce(async () => {
  if (isPlayerWaitingToResume) {
    isPlayerWaitingToResume = false;
    TrackPlayer.getQueue().then((queue) => {
      console.log('queue', queue);
      if (queue.length > 0) {
        CarPlay.pushTemplate(carPlayNowPlayingTemplate, true);
        TrackPlayer.play();
      }
    });
  }
}, DEBOUNCE_TIME * 3);

CarPlay.emitter.addListener(
  'didDisconnect',
  debounce(() => {
    console.log('### CarPlay disconnected');
    trackDisconnected();
    TrackPlayer.getPlaybackState()
      .then((state) => {
        if (state.state === State.Playing) {
          isPlayerWaitingToResume = true;
          TrackPlayer.pause();
        }
      })
      .catch((_) => {
        //ignore
      });
  }, DEBOUNCE_TIME),
);

CarPlay.emitter.addListener('backButtonPressed', () => {
  console.log('### Back button pressed');
  CarPlay.popTemplate();
});
